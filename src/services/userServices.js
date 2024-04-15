import { userModel } from '~/models/user.model'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { generateAccessToken } from '~/middlewares/jwt'
import { boardModel } from '~/models/board.model'
import { cloneDeep } from 'lodash'

const register = async (reqBody) => {
  const newUser = {
    ...reqBody
  }

  await userModel.register(newUser)

  return { message: 'Register successful!', user: newUser }
}

const login = async (reqBody) => {
  const user = {
    ...reqBody
  }

  const result = await userModel.login(user)
  const accessToken = generateAccessToken(result._id, result.role)
  return { message: 'Login successful!', user: result, accessToken }
}

const getDetailUser = async (userId) => {
  const user = await userModel.findOneById(userId)
  const boards = await boardModel.getAll()

  const cloneUser = cloneDeep(user)
  const findBoardByCreatedUser = boards?.filter((b) => b.createdBy.toString() === cloneUser._id.toString())
  cloneUser.boardIds = findBoardByCreatedUser

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }

  return cloneUser
}

const getAll = async () => {
  const users = await userModel.getAll()

  if (!users) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }

  return users
}

export const userServices = { register, getDetailUser, login, getAll }
