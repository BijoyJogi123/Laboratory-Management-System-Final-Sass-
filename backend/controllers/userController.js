// controllers/userController.js
const User = require('../models/userModel');

// Controller to add a user
exports.addUser = (req, res) => {
  const { name, email, password } = req.body;
  User.addUser(name, email, password, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'User added successfully', result });
  });
};

// Controller to get all users
exports.getUsers = (req, res) => {
  User.getAllUsers((err, users) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json(users);
  });
};
