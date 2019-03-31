const axios = require('axios')
const cheerio = require('cheerio')

const scrapScore = async () => {
  const htmlContent = await axios
    .get('http://scores.sify.com')
    .then(res => res.data)
  const $ = cheerio.load(htmlContent)
  const teams = $(
    '.tab-content .tab-pane.active.allongoing#match1 li .scoresbox-center h2'
  ).text()
  const currentScore = $(
    '.tab-content .tab-pane.active.allongoing#match1 li .scoresbox-center #batteamnameruns1'
  ).text()
  return {
    teams,
    score: currentScore
  }
}

const fetchScore = async () => {
  const scoreData = await scrapScore()
  return scoreData
}

module.exports = {
  fetchScore
}
