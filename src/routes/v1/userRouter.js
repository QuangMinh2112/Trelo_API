import express from 'express'
import { userValidation } from '~/validations/userValidate'
import { userController } from '~/controllers/userController'

const Router = express.Router()

Router.route('/').get(userController.getAll).post(userValidation.login, userController.login)

Router.route('/:id').get(userController.getDetailUser)

Router.route('/register').post(userValidation.register, userController.register)

export const userRoutes = Router
