const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const Book = require('../models/Book');
const Member = require('../models/Member');
const Transaction = require('../models/Transaction');

const DAY = 24 * 60 * 60 * 1000;
const LOAN_DAYS = 14;
const MAX_BOOKS_PER_MEMBER = 3;
const FINE_PER_DAY = 5; // Rs.

router.get('/', async (req, res, next) => {
  try {
    const list = await Transaction.find()
      .populate('book', 'title author isbn')
      .populate('member', 'name email')
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
});

router.post(
  '/issue',
  [
    body('bookId').isMongoId().withMessage('Select a valid book'),
    body('memberId').isMongoId().withMessage('Select a valid member'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { bookId, memberId } = req.body;

      const member = await Member.findById(memberId);
      if (!member) return res.status(404).json({ message: 'Member not found' });

      const active = await Transaction.find({ member: memberId, returnDate: null });
      if (active.length >= MAX_BOOKS_PER_MEMBER) {
        return res.status(400).json({ message: `Member already has ${MAX_BOOKS_PER_MEMBER} books issued` });
      }
      if (active.some(t => String(t.book) === bookId)) {
        return res.status(400).json({ message: 'Member already has a copy of this book' });
      }

      // Atomic decrement: only succeeds if a copy is available
      const book = await Book.findOneAndUpdate(
        { _id: bookId, availableCopies: { $gt: 0 } },
        { $inc: { availableCopies: -1 } },
        { new: true }
      );
      if (!book) {
        const exists = await Book.exists({ _id: bookId });
        return res.status(exists ? 400 : 404).json({
          message: exists ? 'No copies available' : 'Book not found',
        });
      }

      try {
        const tx = await Transaction.create({
          book: bookId,
          member: memberId,
          dueDate: new Date(Date.now() + LOAN_DAYS * DAY),
        });
        res.status(201).json(tx);
      } catch (err) {
        await Book.findByIdAndUpdate(bookId, { $inc: { availableCopies: 1 } }); // rollback
        throw err;
      }
    } catch (e) { next(e); }
  }
);

router.post('/return/:id', param('id').isMongoId().withMessage('Invalid id'), validate, async (req, res, next) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });

    const now = new Date();
    const lateDays = Math.max(0, Math.ceil((now - tx.dueDate) / DAY));
    const fine = lateDays * FINE_PER_DAY;

    // Conditional update prevents double-return
    const updated = await Transaction.findOneAndUpdate(
      { _id: tx._id, returnDate: null },
      { returnDate: now, fine },
      { new: true }
    );
    if (!updated) return res.status(400).json({ message: 'Book already returned' });

    await Book.findByIdAndUpdate(tx.book, { $inc: { availableCopies: 1 } });
    res.json(updated);
  } catch (e) { next(e); }
});

module.exports = router;
