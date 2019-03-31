require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const moment = require('moment')
const { createBotReply, getBotResponse } = require('./utility')

// =========================
// EXPRESS CONFIGURATION
// =========================
app.use(express.static(path.join(__dirname, '/public')))

// =========================
// SOCKET CONFIGURATION
// =========================
io.on('connection', function(socket) {
  /**
   * Variable which stores the current User Info
   */
  let userInfo
  socket.on('set-user-info', data => {
    userInfo = data
    socket.broadcast.emit('new-connection', userInfo)
    socket.emit('bot-reply', createBotReply(`Welcome, ${data.name} !`))
  })

  socket.on('disconnect', function() {
    socket.broadcast.emit('user-disconnect', userInfo)
  })

  socket.on('chat-message', msg => {
    socket.broadcast.emit('reply', {
      message: msg,
      userInfo,
      timestamp: moment().format('h:mm a')
    })
  })

  socket.on('bot-request', async query => {
    const response = await getBotResponse(query, userInfo, socket)
    socket.emit('bot-reply', response)
  })
})

// =========================
// PORT CONFIGURATION
// =========================
const PORT = process.env.PORT || 3000
http.listen(PORT, () => {
  console.log('Server started at PORT:', PORT)
})
