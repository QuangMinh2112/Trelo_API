import express from 'express'
import { cardController } from '~/controllers/cardController'
import { cardValidation } from '~/validations/cardValidate'
import uploadCloud from '~/configs/cloudinary.config'
const Router = express.Router()

Router.route('/').post(cardValidation.createNew, cardController.createNew)
Router.route('/edit_card/:id').put(uploadCloud.single('cover'), cardController.editDetailCard)

export const cardRoutes = Router
