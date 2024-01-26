import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { boardModel } from '~/models/board.model'
import { columnModel } from '~/models/column.model'
import { cardModel } from '~/models/card.model'

const createNew = async (reqBody) => {
  const newBoard = {
    ...reqBody,
    slug: slugify(reqBody.title)
  }

  const createdBoard = await boardModel.createNew(newBoard)
  const result = await boardModel.findOneById(createdBoard.insertedId)
  return result
}
const update = async (boardId, reqBody) => {
  const updateData = {
    ...reqBody,
    updatedAt: Date.now()
  }

  const updatedBoard = await boardModel.update(boardId, updateData)

  return updatedBoard
}
const moveCardTwoDifferentColumn = async (reqBody) => {
  try {
    // 1. Update cardOrderIds of prev column
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })

    // 2. Update cardOrderIds of next column
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })

    return { updateResult: 'Successfully!' }
  } catch (error) {
    throw new Error(error)
  }
}
const getDetails = async (boardId) => {
  const board = await boardModel.getDetails(boardId)

  if (!board) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
  }

  const cloneBoard = cloneDeep(board)
  cloneBoard?.columns?.forEach((column) => {
    column.cards = cloneBoard.cards.filter((card) => card.columnId.toString() === column._id.toString())
  })
  delete cloneBoard.cards

  return cloneBoard
}

export const boardServices = { createNew, getDetails, update, moveCardTwoDifferentColumn }
