const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const Member = require('../models/Member');
const Transaction = require('../models/Transaction');

const idRule = param('id').isMongoId().withMessage('Invalid member id');

const memberRules = [
  body('name')
    .trim()
    .matches(/^[A-Za-z][A-Za-z .'-]{1,59}$/)
    .withMessage('Name must contain only letters and spaces (2-60 chars)'),
  body('email').trim().isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('phone')
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Phone must be a valid 10-digit mobile number'),
];

router.get('/', async (req, res, next) => {
  try {
    res.json(await Member.find().sort({ createdAt: -1 }));
  } catch (e) { next(e); }
});

router.post('/', memberRules, validate, async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    res.status(201).json(await Member.create({ name, email, phone }));
  } catch (e) { next(e); }
});

router.put('/:id', [idRule, ...memberRules], validate, async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { name, email, phone },
      { new: true, runValidators: true }
    );
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (e) { next(e); }
});

router.delete('/:id', idRule, validate, async (req, res, next) => {
  try {
    if (await Transaction.exists({ member: req.params.id, returnDate: null })) {
      return res.status(400).json({ message: 'Cannot delete: member has unreturned books' });
    }
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
