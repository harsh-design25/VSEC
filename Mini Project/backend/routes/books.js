const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');

const idRule = param('id').isMongoId().withMessage('Invalid book id');

const bookRules = [
  body('title').trim().isLength({ min: 2, max: 150 }).withMessage('Title must be 2-150 characters'),
  body('author')
    .trim()
    .matches(/^[A-Za-z][A-Za-z .,'-]{1,99}$/)
    .withMessage("Author must contain only letters, spaces and . , ' - (2-100 chars)"),
  body('isbn')
    .customSanitizer(v => String(v || '').replace(/[-\s]/g, ''))
    .matches(/^(\d{10}|\d{13})$/)
    .withMessage('ISBN must be 10 or 13 digits'),
  body('category').trim().isLength({ min: 2, max: 50 }).withMessage('Category must be 2-50 characters'),
  body('totalCopies')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Copies must be a whole number between 1 and 1000')
    .toInt(),
];

// List (optional ?q= search on title/author/isbn/category)
router.get('/', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const filter = q
      ? {
          $or: ['title', 'author', 'isbn', 'category'].map(f => ({
            [f]: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' },
          })),
        }
      : {};
    res.json(await Book.find(filter).sort({ createdAt: -1 }));
  } catch (e) { next(e); }
});

router.post('/', bookRules, validate, async (req, res, next) => {
  try {
    const { title, author, isbn, category, totalCopies } = req.body;
    const book = await Book.create({ title, author, isbn, category, totalCopies, availableCopies: totalCopies });
    res.status(201).json(book);
  } catch (e) { next(e); }
});

router.put('/:id', [idRule, ...bookRules], validate, async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const { title, author, isbn, category, totalCopies } = req.body;
    const newAvailable = book.availableCopies + (totalCopies - book.totalCopies);
    if (newAvailable < 0) {
      return res.status(400).json({ message: 'Total copies cannot be less than the copies currently issued' });
    }
    Object.assign(book, { title, author, isbn, category, totalCopies, availableCopies: newAvailable });
    await book.save();
    res.json(book);
  } catch (e) { next(e); }
});

router.delete('/:id', idRule, validate, async (req, res, next) => {
  try {
    if (await Transaction.exists({ book: req.params.id, returnDate: null })) {
      return res.status(400).json({ message: 'Cannot delete: some copies are currently issued' });
    }
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
