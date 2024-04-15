import Joi from 'joi'
import { GET_DB } from '~/configs/connectDB'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { userModel } from './user.model'
import { ObjectId } from 'mongodb'
import { boardModel } from './board.model'

const INVITATION_COLLECTION_NAME = 'invitations'

const INVITATION_COLLECTION_SCHEMA = Joi.object({
  inviterId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  inviteeId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  status: Joi.string().valid('pending', 'accepted', 'rejected'),
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id)
      })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const sendInvitation = async (payload, inviterId) => {
  try {
    const existingUser = await GET_DB().collection(userModel.USER_COLLECTION_NAME).findOne({ email: payload.email })
    if (!existingUser) throw new Error('User does not exist in database !!!')

    const invitationData = {
      inviterId: new ObjectId(inviterId),
      inviteeId: new ObjectId(existingUser._id),
      status: 'pending',
      boardId: new ObjectId(payload.boardId),
      createdAt: Date.now()
    }
    const result = await GET_DB().collection(INVITATION_COLLECTION_NAME).insertOne(invitationData)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getDetails = async () => {
  const result = await GET_DB()
    .collection(INVITATION_COLLECTION_NAME)
    .aggregate([
      {
        $lookup: {
          from: boardModel.BOARD_COLLECTION_NAME,
          localField: 'boardId',
          foreignField: '_id',
          as: 'boardId'
        }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'inviterId',
          foreignField: '_id',
          as: 'inviterId'
        }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'inviteeId',
          foreignField: '_id',
          as: 'inviteeId'
        }
      },

      {
        $project: {
          'inviterId._id': 1,
          'inviterId.firstName': 1,
          'inviterId.lastName': 1,
          'inviterId.email': 1,
          'inviterId.createdAt': 1,
          'inviterId.updatedAt': 1,
          'inviterId._destroy': 1,
          'inviteeId._id': 1,
          'inviteeId.firstName': 1,
          'inviteeId.lastName': 1,
          'inviteeId.email': 1,
          'inviteeId.createdAt': 1,
          'inviteeId.updatedAt': 1,
          'inviteeId._destroy': 1,
          status: 1,
          boardId: 1,
          createdAt: 1
        }
      }
    ])
    .toArray()

  return result || []
}

const acceptInvitation = async (invitationId) => {
  if (!invitationId) return
  try {
    const result = await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(invitationId.id) },
        { $set: { status: 'accepted' } },
        { returnDocument: 'after' }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const rejectInvitation = async (invitationId) => {
  if (!invitationId) return
  try {
    const result = await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(invitationId.id) },
        { $set: { status: 'rejected' } },
        { returnDocument: 'after' }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const invitationModel = {
  INVITATION_COLLECTION_NAME,
  INVITATION_COLLECTION_SCHEMA,
  sendInvitation,
  getDetails,
  findOneById,
  acceptInvitation,
  rejectInvitation
}
