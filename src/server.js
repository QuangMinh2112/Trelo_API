/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import { CLOSE_DB, CONNECT_DB } from '~/configs/connectDB'
import { env } from '~/configs/environment'

const START_SERVER = () => {
  const app = express()

  app.use(express.json())

  app.get('/', async (req, res) => {
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
    console.log(`2. I am running at http://${env.APP_HOST}:${env.APP_PORT}/`)
  })

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
