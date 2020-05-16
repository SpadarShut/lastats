const admin = require('firebase-admin');

exports.saveSms = function (text) {
  const db = admin.firestore()
  return db.collection('sms').add({
    text,
    time: new Date().getTime()
  })
}