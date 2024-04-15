import { StatusCodes } from 'http-status-codes'
import { invitationService } from '~/services/invitationServices'

const sendInvitation = async (req, res, next) => {
  try {
    const inviterId = req.user._id
    const sendEmailToUser = await invitationService.sendInvitation(req.body, inviterId)

    res.status(StatusCodes.CREATED).json(sendEmailToUser)
  } catch (error) {
    next(error)
  }
}

const getDetailsInvitation = async (req, res, next) => {
  try {
    const invitation = await invitationService.getDetails()
    res.status(StatusCodes.OK).json(invitation)
  } catch (error) {
    next(error)
  }
}

const acceptInvitation = async (req, res) => {
  const invitationId = req.params
  const invitation = await invitationService.acceptInvitation(invitationId)
  res.status(StatusCodes.OK).json(invitation)
}

const rejectInvitation = async (req, res) => {
  const invitationId = req.params
  const invitation = await invitationService.rejectInvitation(invitationId)
  res.status(StatusCodes.OK).json(invitation)
}

export const invitationController = { sendInvitation, getDetailsInvitation, acceptInvitation, rejectInvitation }
