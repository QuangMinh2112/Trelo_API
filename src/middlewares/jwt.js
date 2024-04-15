import jwt from 'jsonwebtoken'

export const generateAccessToken = (id, role) => {
  return jwt.sign({ _id: id, role }, process.env.ACCESS_TOKEN, { expiresIn: '2d' })
}
