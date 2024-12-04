const jwt = require('jsonwebtoken')

const User = require('../model/user.model.js')

class UnauthorizedError extends Error {}

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) {
      throw new UnauthorizedError()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    if (!decoded.userId) {
      throw new UnauthorizedError()
    }

    const user = await User.findById(decoded.userId)
    if (!user) {
      throw new UnauthorizedError()
    }

    req.user = user

    next()
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).send({ message: "Unauthorized" })
    }

    console.log(error)
    return res.status(500).send({ message: "Internal Server Error" })
  }
}

module.exports = verifyToken