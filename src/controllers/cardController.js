import { StatusCodes } from 'http-status-codes'
import { cardServices } from '~/services/cardServices'

const createNew = async (req, res, next) => {
  try {
    const createdCard = await cardServices.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdCard)
  } catch (error) {
    next(error)
  }
}

export const cardController = { createNew }
