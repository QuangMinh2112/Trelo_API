import Joi from 'joi'

const boardCollectionName = 'boards'

const boardCollectionSchema = Joi.object({
  title: Joi.string().required().min(3).max(20),
  description: Joi.string(),
  type: Joi.string().required(),
  ownerIds: Joi.array().default([]),
  memberIds: Joi.array().items(Joi.string()).default([]),
  columnOrderIds: Joi.array().items(Joi.string()).default([]),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
  return await boardCollectionSchema.validateAsync(data, { abortEarly: false })
}

// abortEarly -> mặc định sẽ là true, khi để thành false thì nếu như lúc chạy API mà có 2 trường bị lỗi
// thì nó sẽ trả về lỗi của 2 trường đó, còn mặc định(true) thì nó sẽ trả về lỗi thằng đầu tiên nó tìm được
