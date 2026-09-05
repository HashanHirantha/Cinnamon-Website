import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let initialized = false;

try {
  if (!admin.apps.length) {
    const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
      });
      console.log('🔥 Firebase Admin initialized via serviceAccountKey.json');
      initialized = true;
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      let serviceAccount;
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      } catch {
        const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf8');
        serviceAccount = JSON.parse(decoded);
      }
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
      });
      console.log('🔥 Firebase Admin initialized via FIREBASE_SERVICE_ACCOUNT env');
      initialized = true;
    } else {
      const projectId = process.env.FIREBASE_PROJECT_ID || 'ceylon-cinnamon-pure-gold';
      admin.initializeApp({
        projectId: projectId,
      });
      console.log(`🔥 Firebase Admin initialized with Project ID: ${projectId}`);
      initialized = true;
    }
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin initialization warning:', error.message);
}

import { getFirestore } from 'firebase-admin/firestore';

const databaseId = process.env.FIRESTORE_DATABASE_ID || 'default';
let firestoreDb;
try {
  firestoreDb = getFirestore(admin.app(), databaseId);
} catch {
  firestoreDb = admin.firestore();
}

export const db = firestoreDb;
export const FieldValue = admin.firestore.FieldValue;
export const Timestamp = admin.firestore.Timestamp;
export { admin };
export default db;
