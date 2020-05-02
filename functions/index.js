const _functions = require('firebase-functions');
const admin = require('firebase-admin');
const fns = _functions.region('europe-west3')
const { saveStatus } = require('./saveStatus')
const { maybeAddNewEntities } = require('./maybeAddNewEntities')

admin.initializeApp();

exports.saveStatusHttps = fns.https
  .onRequest(async (req, res) => {
    const status = await saveStatus()
    res.send(status);
  })

exports.addEntitiesOnNewStatus = fns.firestore
  .document('statuses/{id}')
  .onCreate((status) => {
    return maybeAddNewEntities(status);
  });

// exports.saveStatus = functions.pubsub
//   .schedule('every day 23:00')
//   .timeZone('Europe/Minsk')
//   .onRun(saveStatus)
