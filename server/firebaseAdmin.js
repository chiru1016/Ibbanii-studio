const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 is missing');
}

const serviceAccountJson = Buffer.from(
  process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
  'base64'
).toString('utf8');

const serviceAccount = JSON.parse(serviceAccountJson);

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert(serviceAccount),
    });

module.exports = {
  auth: () => getAuth(app),
};