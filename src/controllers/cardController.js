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
    const cardId = req.params.id

    const requestBody = req.body

    let coverFile = null
    if (req.file) {
      coverFile = req.file
    }

    // Gọi hàm editDetailCard trong cardService để xử lý cập nhật
    const result = await cardServices.editDetailCard(cardId, requestBody, coverFile)
    // Trả về kết quả cho client
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}
export const cardController = { createNew, editDetailCard }
