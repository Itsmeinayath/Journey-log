const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User "blueprint"

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    // This is the "bodyguard"
    // It checks the 'req.body' for these fields
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    // 1. Check if the "bodyguard" found any errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are errors, send a 400 (Bad Request)
      return res.status(400).json({ errors: errors.array() });
    }

    // 2. Destructure the email and password from the req.body
    const { email, password } = req.body;

    try {
      // 3. Check if user already exists
      let user = await User.findOne({ email: email });

      if (user) {
        // If user exists, send an error
        return res.status(400).json({ msg: 'User already exists' });
      }

      // 4. If user is new, create a new User "instance"
      user = new User({
        email: email,
        password: password,
      });

      // 5. Hash the password (the "one-way-scramble")
      const salt = await bcrypt.genSalt(10); // Create the "salt"
      user.password = await bcrypt.hash(password, salt); // Now the password is "scrambled"

      // 6. Save the user to the database
      await user.save();

      // 7. Create the "login pass" (JWT - JSON Web Token)
      const payload = {
        user: {
          id: user.id, // This 'id' comes from MongoDB
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET, // Your secret string
        { expiresIn: 3600 }, // Expires in 1 hour
        (err, token) => {
          if (err) throw err;
          // 8. Send the "pass" (token) back to the user
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;