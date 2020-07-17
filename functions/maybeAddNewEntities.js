const LacertaAPI = require('./LacertaAPI')
const admin = require('firebase-admin')
const { getHash, getFile, saveFileToBucket, extractImageColors } = require('./fileAPI')

exports.maybeAddNewEntities = async (status) => {
  const emissions = status.data();
  if (!emissions) {
    return null;
  }
  const db = admin.firestore()
  const emissionRequests = new Map();
  const issuerRequests = new Map();

  return Promise.all(
    Object.keys(emissions)
      .map(async (id) => {
        const storedEmissions = db.collection('emissions')
        const storedIssuers = db.collection('issuers')
        const savedEmission = storedEmissions.doc(id)
        if (savedEmission.exists || emissionRequests.has(id)) {
          return null;
        }
        const fetchEmission = LacertaAPI.fetchEmission(id)
        emissionRequests.set(id, fetchEmission)
        const emission = await fetchEmission;

        // todo extract update method starting from here
        const issuerId = emission.issuer_id;
        const issuerRef = storedIssuers.doc(issuerId)
        emission.issuerRef = issuerRef;

        let savingEmission;
        let savingIssuer;
        let savingLogo;

        if (!savedEmission.exists) {
          console.log('Saving new emission', emission)
          if (!savedEmission.data().issuer_logo) {

          }
          savingEmission = storedEmissions.doc(id).set(emission)
        }
        else if (!savedEmission.data().issuer_logo) {
          const {
            fileExists,
            fileName,
            file,
            getFileData
          } = await getLogoData(emission)
          const colors = extractImageColors(await getFileData())
          if (!fileExists) {
            saveFileToBucket({
              path: fileName,
              data: getFileData(),
            })
              .catch((e) => {
                console.log('Error saving file', fileName)
              })
          }
        }

        // Fetch issuer data from site
        if (!issuerRef.exists && !issuerRequests.has(issuerId)) {
          // todo handle case when site page is not available
          const issuerDataRequest = LacertaAPI.getIssuerData(issuerId)
          issuerRequests.set(issuerId, issuerDataRequest)
          const issuerData = await issuerDataRequest

          if (!issuerRef.exists) {
            console.log('Saving new issuer', issuerId)
            issuerData.name = issuerData.name || emission.issuer_name;
            issuerData.full_issuer_name = emission.full_issuer_name;

            savingIssuer = issuerRef.set(issuerData)
          }
        }

        return Promise.all([
          savingEmission,
          savingIssuer
        ])
      })
  )
}

async function getLogoData(emission = {}){
  const { issuer_id, issuer_logo } = emission;

  if (!issuer_id || !issuer_logo) {
    throw new Error('extractIssuerLogo: Invalid emission object', emission)
  }

  const hash = getHash(issuer_logo)
  const fileName = `img/${issuer_id}-${hash}.png`
  const file = await getFile(fileName)
  const [fileExists] = await file.exists()

  return {
    fileName,
    file,
    fileExists,
    getFileData(){
      return new Buffer(issuer_logo, 'base64')
    }
  }
}
