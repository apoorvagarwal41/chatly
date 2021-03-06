const moment = require('moment')
// =========================
// API IMPORTS
// =========================
const weatherApi = require('../APIS/weatherApi')
const newsApi = require('../APIS/newsApi')
const moviesApi = require('../APIS/moviesApi')
const iplApi = require('../APIS/iplApi')

// =========================
// UTILITY FUNCTIONS
// =========================

/**
 * Object which contains the bot information.
 */
const botInfo = {
  name: 'BOT-TIGER'
}

/**
 *
 * @param {any} msg Contains the response from the bot
 * @param {String} type Contains the response type
 */
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
 * @param {SocketIO.Socket} socket instance of the active socket connection
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
    case 'ipl': {
      const scoreData = await iplApi.fetchScore()
      return createBotReply(scoreData, query.type)
    }
    default:
      return createBotReply(`Sorry ${userInfo.name}, I didn't get it.`)
  }
}

module.exports = {
  createBotReply,
  getBotResponse
}
