/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import cors from 'cors'
import { CLOSE_DB, CONNECT_DB } from '~/configs/connectDB'
import { env } from '~/configs/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { app, server } from './sockets/socket'

const START_SERVER = () => {
  app.use(express.json())
  app.use(cors())

  // User API v1
  app.use('/v1', APIs_V1)

  // Middleware handlle error
  app.use(errorHandlingMiddleware)

  if (env.BUILD_MODE === 'production') {
    server.listen(process.env.PORT, () => {
      console.log(`2. I am running on Production at Port ${process.env.PORT}`)
    })
  } else {
    server.listen(process.env.LOCAL_DEV_APP_PORT, process.env.LOCAL_DEV_APP_HOST, () => {
      console.log(`2. I am running at http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}`)
    })
  }

  // Thực hiện các tác vụ cleanup trước khi dừng server
  exitHook(() => {
    console.log('4. Disconect from MongoDB Atlas')
    CLOSE_DB()
  })
}
// IIFE (Immediately Invoked Function Expression)
;(async () => {
  try {
    console.log('1. Connected to MongoDB Cloud Atlas!')
    await CONNECT_DB()
    START_SERVER()
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
})()
