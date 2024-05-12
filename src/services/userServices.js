import { userModel } from '~/models/user.model'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { generateAccessToken } from '~/middlewares/jwt'
import { boardModel } from '~/models/board.model'
import { cloneDeep } from 'lodash'
import { invitationModel } from '~/models/invitation.model'

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
  const invitations = await invitationModel.getAll()

  const cloneUser = cloneDeep(user)
  const filterInvitations = invitations?.filter(
    (invitation) => invitation.status === 'accepted' && invitation.inviteeId.toString() === cloneUser._id.toString()
  )
  const acceptedBoardIds = filterInvitations.map((invitation) => invitation.boardId.toString())
  const acceptedBoards = boards.filter((board) => acceptedBoardIds.includes(board._id.toString()))
  const findBoardByCreatedUser = boards?.filter((b) => b.createdBy.toString() === cloneUser._id.toString())
  const combinedBoards = [...findBoardByCreatedUser, ...acceptedBoards]

  cloneUser.boardIds = combinedBoards

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

const updateInfo = async (userId, reqBody) => {
  const updatedUser = await userModel.updateInfo(userId, reqBody)

  return updatedUser
}

const uploadAvatar = async (userId, path) => {
  const updatedUser = await userModel.uploadAvatar(userId, path)
  return { success: true, updatedUser }
}

const resetPassword = async (idUser, reqBody) => {
  const updatedUser = await userModel.resetPassword(idUser, reqBody)

  return updatedUser
}

export const userServices = { register, getDetailUser, login, getAll, updateInfo, uploadAvatar, resetPassword }
