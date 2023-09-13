/* eslint-disable no-console */
import express from 'express'
import { CONNECT_DB } from '~/configs/connectDB'

const START_SERVER = () => {
  const app = express()

  const hostname = 'localhost'
  const port = 8017

  app.get('/', async (req, res) => {
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(port, hostname, () => {
    console.log(`2. I am running at http://${hostname}:${port}/`)
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
