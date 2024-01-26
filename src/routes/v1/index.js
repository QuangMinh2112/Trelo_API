import express from 'express'

const router = express.Router()
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from '~/routes/v1/boardRouter'
import { cardRoutes } from './cardRouter'
import { columnRoutes } from './columnRouter'

router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'Apis v1 are ready to use' })
})
// Board API
router.use('/boards', boardRoutes)

// Column API
router.use('/columns', columnRoutes)

// Card API
router.use('/cards', cardRoutes)

export const APIs_V1 = router
