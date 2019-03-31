const axios = require('axios')
const newsAxios = axios.create({
  baseURL: 'https://newsapi.org/v2/top-headlines',
  params: {
    apiKey: process.env.NEWSAPI_KEY,
    country: 'in'
  }
})

exports.getTopNews = async query => {
  const topNews = await newsAxios({
    method: 'get'
  })
    .then(res => res.data.articles)
    .catch(res => console.log(res))
  return topNews.slice(0, 5)
}

module.exports = exports
