import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardController } from '~/controllers/boardController'
import { boardValidation } from '~/validations/boardValidate'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Apis get list boards are ready to use', code: StatusCodes.OK })
  })
  .post(boardValidation.createNew, boardController.createNew)

Router.route('/:id').get(boardController.getDetailBoard).put(boardValidation.update, boardController.update)

// Api supports move card between two columns
Router.route('/support/moving_card').put(
  boardValidation.moveCardTwoDifferentColumn,
  boardController.moveCardTwoDifferentColumn
)

export const boardRoutes = Router
