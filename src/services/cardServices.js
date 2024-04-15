import { cardModel } from '~/models/card.model'
import { columnModel } from '~/models/column.model'

const createNew = async (reqBody) => {
  const newCard = {
    ...reqBody
  }

  const createdCard = await cardModel.createNew(newCard)
  const getNewCard = await cardModel.findOneById(createdCard.insertedId)

  if (getNewCard) {
    await columnModel.pushCardOrderIds(getNewCard)
  }

  return getNewCard
}

const editDetailCard = async (cardId, reqBody) => {
  const updatedData = {
    ...reqBody,
    updatedAt: Date.now()
  }
  const updatedCard = await cardModel.updateCardDetail(cardId, updatedData)

  return { success: updatedCard ? true : false, updatedCard }
}

export const cardServices = { createNew, editDetailCard }
