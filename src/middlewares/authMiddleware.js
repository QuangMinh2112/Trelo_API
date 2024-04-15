import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'

const authenticateToken = async (req, res, next) => {
  //Bearer token
  const bearerToken = req?.headers?.authorization?.startsWith('Bearer')

  if (bearerToken) {
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decode) => {
      if (err)
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid access token'
        })
      req.user = decode
      next()
    })
  } else {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Require authentication!!!'
    })
  }
}

export default authenticateToken
