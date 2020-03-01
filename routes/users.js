const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const jwtSecret = 'xyz1234abcd4321';

router.use(async (req, res, next) => {
  const token =
    req.headers['x-access-token'] || req.body.token || req.query.token;

  if (token) {
    try {
      const payload = jwt.verify(token, jwtSecret);
      if (payload.roles.includes('admin')) {
        next();
      } else {
        res.json({ success: false });
      }
    } catch (e) {
      res.json({ success: false });
    }
  } else {
    res.json({ success: false });
  }
});

router.get('/', async (req, res) => {
  const users = await User.find({});
  res.json(users);
});
router.post('/new', async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      roles: req.body.roles
    });

    await user.save();

    res.json({ success: true });
  } catch (error) {
    res.json({
      success: false,
      errors: Object.keys(e.errors)
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.json({
      success: false,
      errors: Object.keys(e.errors)
    });
  }
});

module.exports = router;
