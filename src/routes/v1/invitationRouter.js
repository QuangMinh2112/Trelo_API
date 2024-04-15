import express from 'express'
import { invitationController } from '~/controllers/invitationController'
import authenticateToken from '~/middlewares/authMiddleware'
import { invitationValidate } from '~/validations/invitationValidate'

const Router = express.Router()

Router.route('/invite').post(
  [authenticateToken],
  invitationValidate.sendInvitation,
  invitationController.sendInvitation
)
Router.route('/').get([authenticateToken], invitationController.getDetailsInvitation)

Router.route('/:id/accept').put([authenticateToken], invitationController.acceptInvitation)
Router.route('/:id/reject').put([authenticateToken], invitationController.rejectInvitation)

export const invitationRoutes = Router
