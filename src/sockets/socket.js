import { Server } from 'socket.io'
import http from 'http'
import express from 'express'

const app = express()

const server = http.createServer(app)
// https://trello-web-quang-minh.vercel.app
const io = new Server(server, {
  cors: {
    origin: ['https://trello-web-quang-minh.vercel.app'],
    methods: ['GET', 'POST']
  }
})

let onlineUsers = []

const addNewUser = (email, socketId) => {
  !onlineUsers.some((user) => user.email === email) && onlineUsers.push({ email, socketId })
}

const getUser = (email) => {
  return onlineUsers?.find((user) => user.email === email)
}
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId)
}
io.on('connection', async (socket) => {
  socket.on('newUser', (email) => {
    addNewUser(email, socket.id)
  })

  socket.on('sendNotification', ({ inviteerEmail, inviteeEmail, boardName, inviteerName, status, invitationId }) => {
    const receiver = getUser(inviteeEmail)

    io.to(receiver?.socketId).emit('getNotification', {
      _id: invitationId,
      inviteerEmail,
      boardName,
      inviteerName,
      status
    })
  })
  socket.on('disconnect', () => {
    removeUser(socket.id)
  })
})

export { app, io, server }

// Send event to the client => use io
// to send every client => use io.emit
// to send one client =>use io.to(socketId).emit
// take event from client => use socket.on
// Send event to server => use socket.emit
// Take event from server => use socket.on
