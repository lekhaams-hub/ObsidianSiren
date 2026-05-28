const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

console.log("FIREBASE_PROJECT_ID =", projectId);
console.log("FIREBASE_CLIENT_EMAIL exists =", !!clientEmail);
console.log("FIREBASE_PRIVATE_KEY exists =", !!privateKey);

if (!projectId || !clientEmail || !privateKey) {
  throw new Error("Missing Firebase Admin env variables in .env");
}

if (!admin.apps.length) {
  const serviceAccount = {
    project_id: projectId,
    client_email: clientEmail,
    private_key: privateKey,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

module.exports = { admin, db };