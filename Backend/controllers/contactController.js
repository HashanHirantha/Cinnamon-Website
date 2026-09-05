import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { createDocument } from '../services/firestoreService.js';

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return errorResponse(res, 'Name, email, and message are required', 400);
    }

    const contactDoc = await createDocument('contacts', {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject ? subject.trim() : 'Website Inquiry',
      message: message.trim(),
      status: 'new', // new | replied | archived
    });

    console.log(`📩 New Contact Message from ${name} (${email}): ${subject}`);

    return successResponse(
      res,
      { id: contactDoc.id },
      'Thank you for reaching out! We will get back to you shortly.',
      201
    );
  } catch (error) {
    next(error);
  }
};
