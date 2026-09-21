import express from 'express';
import nodemailer from 'nodemailer';
import Contact from '../models/Contact.js';
import defaultSiteConfig from '../config/site.js';

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit contact message & send email notification
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message.'
      });
    }

    // 1. Save contact message to MongoDB database (if DB connected)
    let newContact = null;
    try {
      newContact = new Contact({ name, email, message });
      await newContact.save();
    } catch (dbErr) {
      console.warn('Warning: Could not save contact to DB:', dbErr.message);
    }

    // 2. Resolve environment variables for Nodemailer Gmail SMTP
    const gmailUser = process.env.GMAIL_USER || process.env.EMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;
    const recipientEmail = process.env.CONTACT_EMAIL_TO || gmailUser;

    if (!gmailUser || !gmailPass) {
      console.error('Nodemailer Error: Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables.');
      return res.status(500).json({
        success: false,
        message: 'Failed to send email via SMTP.',
        error: 'Server email configuration missing (GMAIL_USER / GMAIL_APP_PASSWORD).'
      });
    }

    // 3. Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });

    const emailSubject = subject ? `[Portfolio Contact] ${subject}` : `New Portfolio Message from ${name}`;

    // 4. Await sendMail call to confirm delivery with Gmail SMTP
    const info = await transporter.sendMail({
      from: `"${name}" <${gmailUser}>`,
      to: recipientEmail,
      replyTo: email,
      subject: emailSubject,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #1F1F2E; border-radius: 8px; max-width: 600px; background-color: #0B0B12; color: #FFFFFF;">
          <h2 style="color: #00F0FF; border-bottom: 1px solid #1F1F2E; padding-bottom: 10px;">New Contact Form Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #FF007A;">${email}</a></p>
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
          <p><strong>Message:</strong></p>
          <div style="margin-top: 10px; padding: 15px; background-color: #151522; border-radius: 6px; border-left: 4px solid #00F0FF;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="font-size: 11px; color: #888888; margin-top: 30px; border-top: 1px solid #1F1F2E; padding-top: 10px;">Sent automatically from Dennis's portfolio backend.</p>
        </div>
      `
    });

    console.log("Email delivered! Message ID:", info.messageId);

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully!',
      messageId: info.messageId,
      contact: newContact
    });
  } catch (error) {
    console.error('Nodemailer Express Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send email via SMTP.',
      error: error.message
    });
  }
});

export default router;

