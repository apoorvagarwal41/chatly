const express = require('express')
const app = express()
const path = require('path')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const moment = require('moment')
require('dotenv').config()

// =========================
// API IMPORTS
// =========================
const weatherApi = require('./APIS/weatherApi')
const newsApi = require('./APIS/newsApi')
const moviesApi = require('./APIS/moviesApi')

// =========================
// EXPRESS CONFIGURATION
// =========================
app.use(express.static(path.join(__dirname, '/public')))

// =========================
// CONSTANTS
// =========================
const botInfo = {
  name: 'BOT-TIGER'
}

// =========================
// SOCKET CONFIGURATION
// =========================
io.on('connection', function(socket) {
  let userInfo

  socket.on('chat-message', msg => {
    socket.broadcast.emit('reply', {
      message: msg,
      userInfo,
      timestamp: moment().format('h:mm a')
    })
  })

  socket.on('set-user-info', data => {
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

// =========================
// UTILITY FUNCTIONS
// =========================
const createBotReply = (msg, type) => ({
  message: msg,
  userInfo: botInfo,
  timestamp: moment().format('h:mm a'),
  reponseType: !type ? 'generic' : type
})

/**
 *
 * @param {Object} query Contains the required information about the user query
 * @param {Object} userInfo current user info
 * @param {SocketIO.Socket} socket instance of the socket connection
 */
const getBotResponse = async (query, userInfo, socket) => {
  switch (query.type) {
    case 'greeting': {
      return createBotReply(`Heyy ${userInfo.name}, What can I do for you ?`)
    }
    case 'weather': {
      const weatherData = await weatherApi.getWeatherReport(query.data)
      return createBotReply(weatherData, query.type)
    }
    case 'movies': {
      const moviesData = await moviesApi.fetchTopMovies()
      return createBotReply(moviesData, query.type)
    }
    case 'news': {
      const newsData = await newsApi.getTopNews()
      return createBotReply(newsData, query.type)
    }
    case 'changeName': {
      botInfo.name = 'BOT-' + query.data.name.toUpperCase()
      return socket.emit('bot-name-change', botInfo)
    }
    case 'ipl':
      break
    default:
      return createBotReply(`Sorry ${userInfo.name}, I didn't get it.`)
  }
}

// =========================
// PORT CONFIGURATION
// =========================
const PORT = process.env.PORT || 3000
http.listen(PORT, () => {
  console.log('Server started at PORT:', PORT)
})
