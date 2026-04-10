import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// CTF CHALLENGE: Students should implement their own email sending logic using Nodemailer or similar.
const mailTransporter = process.env.MAIL_USER && process.env.GMAIL_PASSWORD
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    })
  : null;

const toAddress = process.env.FEEDBACK_TO || 'hargunmadan9034@gmail.com';

router.post('/send', async (req, res) => {
  try {
    const {
      teamName,
      phone,
      email,
      dob,
      favoriteBug,
      severity,
      message,
      stats,
    } = req.body;

    if (!teamName || !email || !dob || !message) {
      return res.status(400).json({ error: 'Submission blocked' });
    }

    // Demo mode: log feedback to console instead of sending email
    if (!mailTransporter) {
      console.log(`\n📬 [DEMO MODE] Feedback Submission`);
      console.log(`├─ Team: ${teamName}`);
      console.log(`├─ Email: ${email}`);
      console.log(`├─ Phone: ${phone}`);
      console.log(`├─ DOB: ${dob}`);
      console.log(`├─ Favorite Bug: ${favoriteBug}`);
      console.log(`├─ Severity: ${severity}`);
      console.log(`├─ Stats: ${JSON.stringify(stats)}`);
      console.log(`└─ Message: ${message}\n`);
      return res.json({ message: 'Feedback submitted successfully' });
    }

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: toAddress,
      subject: `DebugQuest feedback from ${teamName}`,
      text: `Feedback submitted by ${teamName}\nEmail: ${email}\nPhone: ${phone}\nDOB: ${dob}\nFavorite Bug: ${favoriteBug}\nSeverity: ${severity}\nStats: ${JSON.stringify(stats)}\n\nMessage:\n${message}`,
    };

    try {
      await mailTransporter.sendMail(mailOptions);
    } catch (mailError) {
      // Email failed, but accept in demo mode
      console.log(`\n📬 [DEMO MODE - Email failed] Feedback Submission`);
      console.log(`├─ Team: ${teamName}`);
      console.log(`├─ Email: ${email}`);
      console.log(`└─ Message: ${message}\n`);
    }

    return res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Feedback send error:', error);
    return res.status(500).json({ error: 'Submission failed' });
  }
});

export default router;