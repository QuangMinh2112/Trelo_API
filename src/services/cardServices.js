import { cardModel } from '~/models/card.model'
import { columnModel } from '~/models/column.model'
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

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

const editDetailCard = async (cardId, reqBody, coverFile) => {
  const updatedData = {
    ...reqBody,
    updatedAt: Date.now()
  }

  // Nếu có tệp ảnh được tải lên, tải lên ảnh lên Cloudinary và nhận URL
  if (coverFile) {
    const uploadResult = await cloudinary.uploader.upload(coverFile.path)
    updatedData.cover = uploadResult.secure_url
  }

  const updatedCard = await cardModel.updateCardDetail(cardId, updatedData)

  return { success: updatedCard ? true : false, updatedCard }
}

export const cardServices = { createNew, editDetailCard }
