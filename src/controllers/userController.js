import { StatusCodes } from 'http-status-codes'
import { userServices } from '~/services/userServices'

const register = async (req, res, next) => {
  try {
    const createdUser = await userServices.register(req.body)
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const user = await userServices.login(req.body)
    res.status(StatusCodes.CREATED).json(user)
  } catch (error) {
    next(error)
  }
}

const getDetailUser = async (req, res, next) => {
  try {
    const userId = req.params.id
    const userInfo = await userServices.getDetailUser(userId)
    res.status(StatusCodes.OK).json(userInfo)
  } catch (error) {
    next(error)
  }
}
const getAll = async (req, res, next) => {
  try {
    const users = await userServices.getAll()
    res.status(StatusCodes.OK).json(users)
  } catch (error) {
    next(error)
  }
}
export const userController = { register, getDetailUser, login, getAll }
