const express = require('express')
const app = express()
const path = require('path')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const moment = require('moment')
require('dotenv').config()

// API IMPORTS
const weatherApi = require('./APIS/weatherApi')

// EXPRESS CONFIGURATION
app.use(express.static(path.join(__dirname, '/public')))

// CONSTANTS
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
    socket.emit('bot-reply', createBotReply(`Welcome, ${data.name} !`))
  })

  socket.on('bot-request', async query => {
    const response = await getBotResponse(query, userInfo, socket)
    socket.emit('bot-reply', response)
  })

  socket.on('disconnect', function() {
    socket.broadcast.emit('user-disconnect', userInfo)
  })
})

const createBotReply = (msg, type) => ({
  message: msg,
  userInfo: botInfo,
  timestamp: moment().format('h:mm a'),
  reponseType: !type ? 'generic' : type
})

/**
 *
 * @param {Object} query Contains the required information about the user query
 */
const getBotResponse = async (query, userInfo, socket) => {
  console.log(query)
  switch (query.type) {
    case 'greeting': {
      return createBotReply(`Heyy there,${userInfo.name}`)
    }
    case 'weather': {
      const weatherData = await weatherApi.getWeatherReport(query.data)
      return createBotReply(weatherData, query.type)
    }
    case 'ipl':
      break
    case 'election':
      break
    case 'changeName':
      {
        botInfo.name = query.data.name
        return socket.emit('bot-name-change', botInfo)
      }
      break
    default:
      break
  }
}

// PORT CONFIGURATION
const PORT = process.env.PORT || 3000
http.listen(PORT, () => {
  console.log('Server started at PORT:', PORT)
})
