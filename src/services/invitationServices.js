import { invitationModel } from '~/models/invitation.model'
const sendInvitation = async (reqBody, inviterId) => {
  const payload = {
    ...reqBody,
    createdAt: Date.now()
  }

  const createdSendInvitation = await invitationModel.sendInvitation(payload, inviterId)
  const result = await invitationModel.findOneById(createdSendInvitation.insertedId)
  console.log('🚀 ~ sendInvitation ~ result:', result)
  return { success: result ? true : false, data: result }
}

const getDetails = async () => {
  const invitation = await invitationModel.getDetails()

  return invitation
}

const acceptInvitation = async (invitationId) => {
  const invitation = await invitationModel.acceptInvitation(invitationId)

  return invitation
}

const rejectInvitation = async (invitationId) => {
  const invitation = await invitationModel.rejectInvitation(invitationId)

  return invitation
}

export const invitationService = { sendInvitation, getDetails, acceptInvitation, rejectInvitation }
