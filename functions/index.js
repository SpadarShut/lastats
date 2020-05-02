const fs = require('fs').promises;
const _functions = require('firebase-functions');
const admin = require('firebase-admin');
const fns = _functions.region('europe-west3')
const { saveStatus } = require('./saveStatus')
const { maybeAddNewEntities } = require('./maybeAddNewEntities')
const LacertaAPI = require('./LacertaAPI')

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

exports.importData = fns.https.onRequest((req, resp) => {
  console.log(process.cwd());

  return Promise.all([1].map((date) => {
    fs
      .readFile(`../public/${date}.json`, 'utf-8')
      .then((file) => {
        const data = JSON.parse(file)
        return saveStatus(
          LacertaAPI.processStatuses(data.data),
          String(new Date(data.time).getTime())
        )
      })
      .catch((e) => {
        console.log(e)
      })
  }))
})
