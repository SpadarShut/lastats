const LacertaAPI = require('./LacertaAPI')
const admin = require('firebase-admin');

exports.saveStatus = async (data, name) => {
  // Grab the text parameter.
  // const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.

  data = data || await LacertaAPI.getEmissionsStatus()
  name = name || String(new Date().getTime())
  const db = admin.firestore()
  const result = data.reduce((acc, d) => {
    acc[d.id] = d;
    return acc;
  }, {})

  return db
    .collection('statuses')
    .doc(name)
    .set(result)
    .then((res) => {
      console.log('Statuses updated!', res)
      return res;
    })
}