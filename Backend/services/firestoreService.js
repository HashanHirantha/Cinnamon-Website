import db, { FieldValue } from '../config/firebase.js';

export const getCollection = async (collectionName, options = {}) => {
  const {
    where = [], // array of [field, op, value]
    orderBy = null, // [field, direction]
    limit = null,
    offset = null,
  } = options;

  let query = db.collection(collectionName);

  for (const condition of where) {
    if (condition && condition.length === 3 && condition[2] !== undefined && condition[2] !== '') {
      query = query.where(condition[0], condition[1], condition[2]);
    }
  }

  if (orderBy && orderBy[0]) {
    query = query.orderBy(orderBy[0], orderBy[1] || 'asc');
  }

  // To count total matches for pagination
  const snapshotAll = await query.get();
  const total = snapshotAll.size;

  if (offset) {
    query = query.offset(Number(offset));
  }

  if (limit) {
    query = query.limit(Number(limit));
  }

  const snapshot = await query.get();
  const docs = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return { docs, total };
};

export const getDocumentById = async (collectionName, id) => {
  const doc = await db.collection(collectionName).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const getDocumentByField = async (collectionName, field, value) => {
  const snapshot = await db.collection(collectionName).where(field, '==', value).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

export const createDocument = async (collectionName, data, customId = null) => {
  const timestamp = new Date().toISOString();
  const docData = {
    ...data,
    createdAt: data.createdAt || timestamp,
    updatedAt: timestamp,
  };

  let docRef;
  if (customId) {
    docRef = db.collection(collectionName).doc(customId);
    await docRef.set(docData);
  } else {
    docRef = await db.collection(collectionName).add(docData);
  }

  return { id: docRef.id, ...docData };
};

export const updateDocument = async (collectionName, id, data) => {
  const docRef = db.collection(collectionName).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;

  const updateData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  await docRef.update(updateData);
  return { id, ...doc.data(), ...updateData };
};

export const deleteDocument = async (collectionName, id) => {
  const docRef = db.collection(collectionName).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return false;

  await docRef.delete();
  return true;
};
