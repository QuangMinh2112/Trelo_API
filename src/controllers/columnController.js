import { StatusCodes } from 'http-status-codes'
import { columnServices } from '~/services/columnServices'

const createNew = async (req, res, next) => {
  try {
    const createdColumn = await columnServices.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdColumn)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const columnId = req.params
    const updatedColumn = await columnServices.update(columnId, req.body)
    res.status(StatusCodes.OK).json(updatedColumn)
  } catch (error) {
    next(error)
  }
}
const deleteItem = async (req, res, next) => {
  try {
    const columnId = req.params.id
    const result = await columnServices.deleteItem(columnId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}
export const columnController = { createNew, update, deleteItem }
