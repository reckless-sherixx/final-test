const express = require('express');
const router = express.Router();
const User = require('../model/user.model.js')
const generateToken = require('../middleware/generateToken.js')
const bcrypt = require('bcrypt');

// Register a user
router.post('/register', async (req, res) => {
  try {
    const { username } = req.body;
    const password = "1234";
    const user = new User({ password, username });
    //console.log(user);
    await user.save();
    res.status(200).json({ message: 'User Registerd successfully!', user: user });
  } catch (error) {
    console.error("Failed to Register", error);
    res.status(500).json({ message: "Registration Failed!" });
  }
})

// Login  a user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body)
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: 'User Not Found.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid Password.' });
    }

    // Generate token here
    const token = await generateToken(user._id)
    const options = {
      httpOnly: true, // enable this only when u have https
      secure: true,
      sameSite: true
    }
    res.cookie("token", token, options);
    res.cookie("isLoggedIn", true, { ...options, httpOnly: false });
    res.status(200).send({
      message: 'User logged in successfully!', token, user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Failed to Login", error);
    res.status(500).json({ message: "Login Failed!" });
  }
})

// Logout  a user
router.post('/logout', async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send({ message: 'Logged out successfully!' });
  } catch (error) {
    console.error("Failed to logout.", error);
    res.status(500).send({ message: "Logout Failed!" });
  }
})

// Get  users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'id username role');
    res.status(200).send({ message: "Users Found Sucessfully", users });
  } catch (error) {
    console.error("Error Fetching Users.", error);
    res.status(500).send({ message: "Failed to fetch users!" });

  }
})

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }
    res.status(200).send({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("Error Deleting User.", error);
    res.status(500).send({ message: "Error Deleting!" });
  }
})

// Update a role for user
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }
    res.status(200).send({ message: "User Role updated successfully!", user });
  } catch (error) {
    console.error("Error Updating The Role.", error);
    res.status(500).send({ message: "Error Updating Role!" });
  }
})

//Update
router.put('/users/password/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let { password } = req.body;
    password = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(id, { password }, { new: true });
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }
    res.status(200).send({ message: "User Password updated successfully!", user });
  } catch (error) {
    console.error("Error chnaging password", error);
    res.status(500).send({ message: "Error changing password" });
  }
})

module.exports = router;