import { StatusCodes } from 'http-status-codes'
import { userServices } from '~/services/userServices'

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      next(new Error('No file uploaded!'))
      return
    }
    const path = req.file.path
    const userId = req.params.id
    const updatedAvatarUser = await userServices.uploadAvatar(userId, path)
    res.status(StatusCodes.OK).json(updatedAvatarUser)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

export const uploadController = { uploadAvatar }
