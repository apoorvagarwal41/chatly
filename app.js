const express = require('express')
const app = express()
const path = require('path')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const moment = require('moment')
// CONFIGURATION
app.use(express.static(path.join(__dirname, '/public')))

const botInfo = {
  name: 'BOT-TIGER'
}

// SOCKET CONFIGURATION
io.on('connection', function(socket) {
  let userInfo

  socket.on('chat-message', msg => {
    socket.broadcast.emit('reply', {
      message: msg,
      userInfo,
      timestamp: moment().format('h:mm a')
    })
  })

  socket.on('user-info', data => {
    userInfo = data
    socket.broadcast.emit('new-connection', userInfo)
    socket.emit('reply', {
      message: `Welcome, ${data.name} !`,
      userInfo: botInfo,
      timestamp: moment().format('h:mm a')
    })
  })

  socket.on('ask-bot', question => {
    socket.emit('bot-reply', 'Heyy there')
  })

  socket.on('disconnect', function() {
    socket.broadcast.emit('user-disconnect', userInfo)
  })
})

const PORT = process.env.PORT || 3000
http.listen(PORT, () => {
  console.log('Server started at PORT:', PORT)
})
