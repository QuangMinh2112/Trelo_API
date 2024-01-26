import { StatusCodes } from 'http-status-codes'
import { boardServices } from '~/services/boardServices'

const createNew = async (req, res, next) => {
  try {
    const createdBoard = await boardServices.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const boardId = req.params
    const updatedBoard = await boardServices.update(boardId, req.body)
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) {
    next(error)
  }
}

const getDetailBoard = async (req, res, next) => {
  try {
    const boardId = req.params
    const board = await boardServices.getDetails(boardId)
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }
}
const moveCardTwoDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardServices.moveCardTwoDifferentColumn(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const boardController = { createNew, getDetailBoard, update, moveCardTwoDifferentColumn }
