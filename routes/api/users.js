const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const eventEmitter = require('../../plugins/EventEmitter/eventEmitter');
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        topic: req.body.topic,
        email: req.body.email,
        password: req.body.password,
        role: 0,
        isApproved: false
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/users", (req, res) => {
  User.find({ 'role': 0 }).sort({ date: -1 })
    .then(users => res.json(users));
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/approve", (req, res) => {
  const id = req.body.id;
  User.findById(id, function (err, user) {
    if (err) {
      return res.status(400).json(err);
    }
    user.isApproved = true;
    eventEmitter.emit('update-subscription', id);
    // save the user
    user.save(function (err) {
      if (err) {
        return res.status(400).json(err);
      }
      return res.json({ message: "User successfully Approved!" });
    });
  });
});


// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/disapprove", (req, res) => {
  const id = req.body.id;
  User.findById(id, function (err, user) {
    if (err) {
      return res.status(400).json(err);
    }
    user.isApproved = false;
    eventEmitter.emit('remove-subscription',id);
    // save the user
    user.save(function (err) {
      if (err) {
        return res.status(400).json(err);
      }
      return res.json({ message: "User successfully Disapproved!" });
    });
  });
});
router.post("/topic", (req, res) => {
  const id = req.body.id;
  const topic = req.body.topic;
  User.findById(id, function (err, user) {
    if (err) {
      return res.status(400).json(err);
    }
    let newTopicArray = [...user.topic, topic];
    user.topic = newTopicArray;  
    eventEmitter.emit('update-subscription',id);    
    // save the user
    user.save(function (err) {
      if (err) {
        return res.status(400).json(err);
      }
      return res.json({ topic: user.topic });
    });
  });
});

router.post("/update-sensor-point", (req, res) => {
  const id = req.body.id;
  const sensorPoints = req.body.sensorPoints;
  User.findById(id, function (err, user) {
    if (err) {
      return res.status(400).json(err);
    }
    user.sensorPoints = sensorPoints
    eventEmitter.emit('update-sensor-points', user.email, user.sensorPoints);
    // save the user
    user.save(function (err) {
      if (err) {
        return res.status(400).json(err);
      }
      return res.json({ sensorPoints: user.sensorPoints });
    });
  });
});

router.post("/publish-message", (req, res) => {
  const topic = req.body.topic;
  const message = req.body.message;
  eventEmitter.emit('publish-message',topic, message); 
  return res.json({ message: "Message published" });
});

router.post("/remove-topic", (req, res) => {
  const id = req.body.id;
  const topicId = req.body.topicId;
  User.findById(id, function (err, user) {
    if (err) {
      return res.status(400).json(err);
    }
    user.topic.splice(topicId, 1);  
    eventEmitter.emit('remove-subscription',id);
    // save the user
    user.save(function (err) {
      if (err) {
        return res.status(400).json(err);
      }
      return res.json({ topic: user.topic });
    });
  });
});

router.post("/refresh", (req, res) => {
  const id = req.body.id;
  User.findById(id, function (err, user) {
    if (err) {
      return res.status(400).json(err);
    }
    // save the user
    var payload={
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      topic: user.topic,
      sensorPoints: user.sensorPoints
    }
    jwt.sign(
      payload,
      keys.secretOrKey,
      {
        expiresIn: 86400 // 1 year in seconds
      },
      (err, token) => {
        res.json({
          success: true,
          token: "Bearer " + token
        });
      }
    );
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    if (user && !user.isApproved) {
      return res
        .status(403)
        .json({ isApproved: "You are not approved by admin. please contact us." });
    }
    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          topic: user.topic,
          sensorPoints: user.sensorPoints
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 86400 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

module.exports = router;
