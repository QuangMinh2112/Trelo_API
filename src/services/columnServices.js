import { boardModel } from '~/models/board.model'
import { cardModel } from '~/models/card.model'
import { columnModel } from '~/models/column.model'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
  const newColumns = {
    ...reqBody
  }

  const createdColumn = await columnModel.createNew(newColumns)
  const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

  if (getNewColumn) {
    getNewColumn.cards = []

    await boardModel.pushColumnOrderIds(getNewColumn)
  }

  return getNewColumn
}
const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)

    return updatedColumn
  } catch (error) {
    throw new Error(error)
  }
}

const updateTitle = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.updateTitle(columnId, updateData)

    return { updatedColumn, success: true }
  } catch (error) {
    throw new Error(error)
  }
}
const deleteItem = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)

    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found')
    }
    // Delete column
    await columnModel.deletedOneById(columnId)
    // Delete card inside column
    await cardModel.deleteManyById(columnId)

    // Delete columnOrderIds inside board
    await boardModel.pullColumnOrderIds(targetColumn)

    return { deletedResult: 'Column and its Card deleted successfully!' }
  } catch (error) {
    throw new Error(error)
  }
}

export const columnServices = { createNew, update, deleteItem, updateTitle }
