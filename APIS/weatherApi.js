// AXIOS INSTANCES
const axios = require('axios')
const weatherAxios = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/weather',
  params: {
    APPID: process.env.OPENWEATHER_KEY
  }
})

exports.getWeatherReport = async coords => {
  const { lat, long: lon } = coords
  const weatherData = await weatherAxios({
    methods: 'get',
    params: {
      lat,
      lon
    }
  })
    .then(res => {
      const data = res.data
      return {
        type: data.weather[0].main,
        temp: data.main.temp - 273.15,
        location: data.name
      }
    })
    .catch(res => {
      console.log(res)
    })
  return weatherData
}

module.exports = exports
