const axios = require('axios')
const cheerio = require('cheerio')
var admin = require("firebase-admin")

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
  return exports.processStatuses([
    ...page0.content,
    ...restPages.reduce((acc, page) => ([...acc, ...page.content]), [])
  ])
}

exports.processStatuses = status => status.map(exports.processEmissionStatus)

exports.processEmissionStatus = em => ({
  id: em.emission_id,
  rest: em.rest_count,
  type: em.emission_type,
})

exports.getPage = async (page = 0) => {
  let data;
  console.log(`Fetching page ${page}`)
  const response = await axios.get(
    `${API_URL}v2/emissions/shorts/`,
    {params: {page}}
  )
  data = response.data

  return data.error
    ? Promise.reject(data.error)
    : data.result
}

exports.fetchEmission = async (id) => {
  if (!id) {
    return null
  }
  console.log('Fetching emission', id)
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
    throw new Error(`No site page field for emission ${emission.id}`)
  }
  const issuer_id = exports.getIssuerId(emission)

  return {
    ...emission,
    issuer_id,
  };
}

exports.getIssuerUrl = function(id) {
  return `https://lacerta.by/${id}`
}

exports.getIssuerId = (emission = {}) => {
  const { reference_on_site = '' } = emission;
  return reference_on_site.replace(/\/$/, '').split('/').pop()
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