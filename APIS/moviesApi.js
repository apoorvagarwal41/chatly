const axios = require('axios')
const moviesAxios = axios.create({
  baseURL: 'https://api.themoviedb.org/3/movie/top_rated',
  params: {
    api_key: process.env.MOVIEAPI_KEY,
    page: 1,
    language: 'en-US'
  }
})

exports.fetchTopMovies = async () => {
  const movieData = await moviesAxios({
    methods: 'get'
  }).then(res => res.data)
  return movieData
}

module.exports = exports
