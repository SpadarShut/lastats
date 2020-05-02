const LacertaAPI = require('./LacertaAPI')
const admin = require('firebase-admin');

exports.saveStatus = async () => {
  // Grab the text parameter.
  // const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.

  const data = await LacertaAPI.getEmissionsStatus()
  const db = admin.firestore()
  const result = data.reduce((acc, d) => {
    acc[d.id] = d;
    return acc;
  }, {})

  return db
    .collection('statuses')
    .doc(String(new Date().getTime()))
    .set(result)
    .then((res) => {
      console.log('Statuses updated!', res)
      return res;
    })
}