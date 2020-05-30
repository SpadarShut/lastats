const fs = require('fs').promises;
const _functions = require('firebase-functions');
const admin = require('firebase-admin');
const fns = _functions.region('europe-west3')
const { saveStatus } = require('./saveStatus')
const { saveSms } = require('./saveSMS')
const { maybeAddNewEntities } = require('./maybeAddNewEntities')
const {extractIssuerLogo} = require('./extractIssuerLogo')
const LacertaAPI = require('./LacertaAPI')
var serviceAccount = require('../creds.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

exports.saveStatusHttps = fns.https
  .onRequest(async (req, res) => {

    const status = await saveStatus()
    res.send(status);
  })

exports.saveSMS = fns.https
  .onRequest(async (req, res) => {
    await saveSms(req.body)
    res.send('ok');
  })

exports.addEntitiesOnNewStatus = fns.firestore
  .document('statuses/{id}')
  .onCreate((status) => {
    return maybeAddNewEntities(status);
  });

exports.updateIssuer = fns.https.onRequest(
  async (req, resp) => {
    console.log('req', req.query.id)
    const Em = await LacertaAPI.fetchEmission(req.query.id)
    const logo = await extractIssuerLogo(Em)

    return logo
})
