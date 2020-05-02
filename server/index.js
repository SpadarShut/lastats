const { getEmissionsStatus, API_URL } = require('../functions/LacertaAPI.js')
const fs = require('fs').promises
const axios = require('axios')
const cheerio = require('cheerio')

getEmissionsStatus().then(data => {
  console.log('Data fetched')

  let prepared = JSON.stringify({
    time: new Date().toISOString(),
    data: data,
  }, null, 2);

  const date = new Date().toISOString().split('T')[0]
  fs.writeFile(`public/combined-${date}.json`, prepared)
    .then((res) => {
      console.log('Done!')
    })
    .catch(e => {
      console.error(e)
    })
})
