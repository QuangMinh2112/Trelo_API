import express from 'express'
import { userValidation } from '~/validations/userValidate'
import { userController } from '~/controllers/userController'
import authenticateToken from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/').get(userController.getAll).post(userValidation.login, userController.login)

Router.route('/:id').get(userController.getDetailUser).put([authenticateToken], userController.updateInfo)

Router.route('/register').post(userValidation.register, userController.register)
Router.route('/reset_pass').post([authenticateToken], userController.resetPassword)
export const userRoutes = Router
