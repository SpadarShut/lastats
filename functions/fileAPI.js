const crypto = require('crypto')
const admin = require('firebase-admin');
const Vibrant = require('node-vibrant')

module.exports = {
  extractIssuerLogo,
  getHash,
  saveFileToBucket,
  extractImageColors
}

function getHash(data) {
  return crypto
    .createHash('sha1')
    .update(data)
    .digest('base64')
    .substring('16');
}

async function saveFileToBucket({path, data, owerwrite}) {
  const file = await getFile(path)
  const [fileExists] = await file.exists()
  if (!owerwrite && fileExists) {
    return false;
  }
  return file
    .save(fileData)
    .then((res) => {
      console.log('File saved!', res)
      return res;
    })
}

export function getFile(filePath) {
  admin.storage().bucket().file(filePath)
}


async function extractIssuerLogo (emission) {
  // const { issuer_id, issuer_logo } = emission;
  // console.log('Extracting Logo ', issuer_id)
  //
  // if (!issuer_id || !issuer_logo) {
  //   throw new Error('extractIssuerLogo: Invalid emission object')
  // }
  // const logoHash = getHash(issuer_logo)
  // const fileName = `img/${issuer_id}-${logoHash}.png`
  const imageData = new Buffer(issuer_logo, 'base64')
  await saveFileToBucket({
      path: fileName,
      data: imageData
    })
    .catch((e, meta) => {
      console.error('Couldnt save logo', e)
    })

  console.log('Saved logo!')
  return {
    fileName,
    buffer: imageData,
  }
}


async function extractImageColors(buffer, options) {
  return Vibrant.from(buffer, options).getPalette()
}