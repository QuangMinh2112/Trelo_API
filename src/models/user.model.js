import Joi from 'joi'
import bcrypt from 'bcrypt'
import { GET_DB } from '~/configs/connectDB'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const USER_COLLECTION_NAME = 'users'

const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password: Joi.string().required().min(3).trim().strict(),
  firstName: Joi.string().required().min(3).trim().strict(),
  lastName: Joi.string().required().min(3).trim().strict(),
  role: Joi.string().valid('admin', 'user').default('admin'),
  isActive: Joi.boolean().default('false'),
  boardIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  avatar: Joi.string().default('https://img.freepik.com/free-icon/user_318-159711.jpg'),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const register = async (data) => {
  try {
    const existingUser = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email: data.email })
    if (existingUser) {
      // if user exists already => throw an error
      throw new Error('User already exists. Please choose a different email.')
    }
    const validateData = await validateBeforeCreate(data)
    // Manually hash the password before saving to the database
    validateData.password = await bcrypt.hash(validateData.password, 10)
    const createdUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validateData)

    return createdUser
  } catch (error) {
    throw new Error(error)
  }
}

const login = async (data) => {
  try {
    const { email, password } = data
    const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email })
    if (!user) {
      throw new Error('User not found')
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      throw new Error('Incorrect password')
    }

    return user
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id)
      })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getAll = async () => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).find({}).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateInfo = async (userId, reqBody) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(userId) }, { $set: reqBody }, { returnDocument: 'after' })

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const uploadAvatar = async (userId, path) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(userId) }, { $set: { avatar: path } }, { returnDocument: 'after' })

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const resetPassword = async (idUser, reqBody) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = reqBody
    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new Error('Missing input value for reset password !')
    }

    if (newPassword !== confirmPassword) {
      throw new Error('The new password does not match !')
    }

    const existingUser = await findOneById(idUser)
    if (!existingUser) {
      throw new Error('User not found')
    }
    const isPasswordMatch = await bcrypt.compare(currentPassword, existingUser.password)

    if (!isPasswordMatch) {
      throw new Error('Incorrect old password')
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(idUser) }, { $set: { password: hashedNewPassword } })
    return { message: 'Password reset successful' }
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  register,
  login,
  findOneById,
  getAll,
  updateInfo,
  uploadAvatar,
  resetPassword
}
