import express from 'express'
import { boardController } from '~/controllers/boardController'
import authenticateToken from '~/middlewares/authMiddleware'
import { boardValidation } from '~/validations/boardValidate'

const Router = express.Router()

Router.route('/')
  .get([authenticateToken], boardController.getAll)
  .post([authenticateToken], boardValidation.createNew, boardController.createNew)

Router.route('/:id')
  .get([authenticateToken], boardController.getDetailBoard)
  .put(boardValidation.update, boardController.update)

// Api supports move card between two columns
Router.route('/support/moving_card').put(
  boardValidation.moveCardTwoDifferentColumn,
  boardController.moveCardTwoDifferentColumn
)

export const boardRoutes = Router
