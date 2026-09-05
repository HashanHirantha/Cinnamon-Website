import db from '../../config/firebase.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';
import { updateDocument } from '../../services/firestoreService.js';

export const getNotifications = async (req, res, next) => {
  try {
    const snapshot = await db.collection('notifications').get();
    const notifications = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    notifications.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return successResponse(res, { notifications, unreadCount }, 'Notifications retrieved');
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await updateDocument('notifications', id, { isRead: true });

    if (!updated) {
      return errorResponse(res, 'Notification not found', 404);
    }

    return successResponse(res, updated, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsRead = async (req, res, next) => {
  try {
    const snapshot = await db.collection('notifications').where('isRead', '==', false).get();
    const batch = db.batch();

    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { isRead: true, updatedAt: new Date().toISOString() });
    });

    await batch.commit();

    return successResponse(res, null, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};
