const crypto = require('crypto')
const admin = require('firebase-admin');

exports.extractIssuerLogo = async function (emission) {
  const { issuer_id, issuer_logo } = emission;
  console.log('Extracting Logo ', issuer_id)

  if (!issuer_id || !issuer_logo) {
    throw new Error('extractIssuerLogo: Invalid emission object')
  }
  const logoHash = crypto
    .createHash('sha256')
    .update(issuer_logo)
    .digest('hex');
  const logoFileName = `img/${issuer_id}-${logoHash}.png`
  const file = await admin.storage().bucket().file(logoFileName)
  const [fileExists] = await file.exists()

  if (!fileExists) {
    console.log('extractIssuerLogo.js extractIssuerLogo ', issuer_id)
    await file
      .save(
        new Buffer(emission.issuer_logo, 'base64')
      )
      .then((res) => {
        console.log('oh yeah!', res)
        return res;
      })
      .catch((e, meta) => {
        console.error('Couldnt save logo', e)
      })
  }

  console.log('Saved logo!')
  return logoFileName
}