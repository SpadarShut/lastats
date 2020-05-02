const LacertaAPI = require('./LacertaAPI')
const admin = require('firebase-admin')

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
        let savingEmission, savingIssuer;
        const savedEmission = storedEmissions.doc(id)
        if (savedEmission.exists || emissionRequests.has(id)) {
          return null;
        }
        const fetchEmission = LacertaAPI.fetchEmission(id)
        emissionRequests.set(id, fetchEmission)
        const emission = await fetchEmission;
        const issuerId = LacertaAPI.getIssuerId(emission.reference_on_site);
        const issuerRef = storedIssuers.doc(issuerId)
        emission.issuerRef = issuerRef;

        if (!savedEmission.exists) {
          console.log('Saving new emission', emission)
          savingEmission = storedEmissions.doc(id).set(emission)
          // todo save images
        }

        if (!issuerRef.exists && !issuerRequests.has(issuerId)) {
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