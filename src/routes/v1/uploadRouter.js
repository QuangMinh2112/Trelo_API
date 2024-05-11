import express from 'express'
import { uploadController } from '~/controllers/uploadController'
import uploadCloud from '~/configs/cloudinary.config'
const Router = express.Router()

Router.route('/:id').put(uploadCloud.single('avatar'), uploadController.uploadAvatar)

export const uploadRoutes = Router
