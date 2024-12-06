const mongoose = require('mongoose');
require('dotenv').config()

const User = require('./src/model/user.model.js')

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URL)

  await User.deleteMany({})

  const name = "User"
  const surname = "Test"
  const grade = "Admin"
  const username = `${name}${surname}${grade}`;
  const password = "1234"

  const user = new User({ username, password, role: "admin" })
  await user.save()

  console.log("Database Seeded")
}

seed()