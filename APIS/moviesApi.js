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
  })
    .then(res => res.data.results)
    .catch(res => console.log(res))
  return movieData.slice(0, 5)
}

module.exports = exports
