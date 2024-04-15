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
const editDetailCard = async (req, res, next) => {
  try {
    const cardId = req.params
    const detailCardBody = await cardServices.editDetailCard(cardId.id, req.body)
    res.status(StatusCodes.OK).json(detailCardBody)
  } catch (error) {
    next(error)
  }
}
export const cardController = { createNew, editDetailCard }
