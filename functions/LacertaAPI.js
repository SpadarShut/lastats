const fs = require('fs').promises;
const path = require('path')
const axios = require('axios')
const cheerio = require('cheerio')
// const crypto = require('crypto')

const API_URL = "https://prod.lacerta.by/api/"

exports.API_URL = API_URL;

exports.getEmissionsStatus = async () => {
  const page0 = await exports.getPage(0);
  const { total_pages } = page0;
  const restPages = await Promise.all(
    new Array(total_pages - 1)
      .fill(true)
      .map((_, i) => exports.getPage(i + 1))
  )
  return [page0, ...restPages]
    .reduce((acc, page) => [...acc, ...page.content], [])
    .map(em => ({
      id: em.emission_id,
      rest: em.rest_count,
      type: em.emission_type,
    }))
}

exports.getPage = async (page = 0) => {
  let fromFiles = process.env.READ_LOCAL_DATA === '1'
  let data;
  console.log(`Fetching page ${page}`)

  if (fromFiles) {
    let json = await fs.readFile(path.resolve(`./server/data/sample-data-page${page}.json`))
    data = JSON.parse(json)
  }
  else {
    const response = await axios.get(
      `${API_URL}v2/emissions/shorts/`,
      {params: {page}}
    )
    data = response.data
  }

  return data.error
    ? Promise.reject(data.error)
    : data.result
}

exports.fetchEmission = async (id) => {
  if (!id) {
    return null
  }
  const {data} = await axios.get(`${API_URL}v2/emissions/${id}`)
  const {result, error} = data;

  if (error) {
    throw new Error(error);
  }

  return processEmission(result)
}

async function processEmission(emission) {
  const { reference_on_site } = emission;
  if (!reference_on_site) {
    throw new Error(`No site page for emission ${emission.id}`)
  }
  const issuer_id = reference_on_site.replace(/\/$/, '').split('/').pop()
  // const issuer_logo = crypto.createHash('sha256')
  //   .update(emission.issuer_logo)
  //   .digest('hex');

  return {
    ...emission,
    issuer_id,
    issuer_logo: ''
  };
}

exports.getIssuerUrl = function(id) {
  return `https://lacerta.by/${id}`
}

exports.getIssuerId = (url = '') => {
  return url.replace(/\/$/, '').split('/').pop()
}


exports.getIssuerData = async function (id) {
  const url = exports.getIssuerUrl(id)
  const { data } = await axios
    .get(url)
    .catch(error => {
      console.log('Couldn\'t fetch issuer', id, error.toString())
      return {
        data: null,
        error,
      }
    });
  const res = {
    id,
    url,
  }

  if (data) {
    const $ = cheerio.load(data);
    res.descr = $('>p', '.layout.content').html();
    res.logo = $('.heading>figure img', '.layout.content').attr('src');
    res.name = $('.heading h1', '.layout.content').text();
  }

  return res;
}