import express from 'express';
import cors from 'cors';
import multer from 'multer';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed file extensions for manuscript uploads
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = join(__dirname, 'uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Preserve original filename with timestamp prefix to avoid conflicts
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.toLowerCase().split('.').pop();
    if (ALLOWED_EXTENSIONS.includes(`.${ext}`)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, TXT, RTF allowed.'), false);
    }
  }
});

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD // Use App Password, not regular password
    }
  });
};

// Verify email configuration on startup
const verifyEmailConfig = async () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('⚠️  Gmail credentials not configured. Email sending will fail.');
    console.warn('    Set GMAIL_USER and GMAIL_APP_PASSWORD in .env file');
    return false;
  }

  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email server connection verified');
    return true;
  } catch (error) {
    console.error('❌ Email server verification failed:', error.message);
    return false;
  }
};

verifyEmailConfig();

// Helper function to send consultation email
const sendConsultationEmail = async ({
  sourcePage,
  service,
  userName,
  userEmail,
  wordCount,
  notes,
  attachments,
  trimSize,
  genrePreset
}) => {
  const transporter = createTransporter();
  const recipient = process.env.EMAIL_RECIPIENT || '71762305054@cit.edu.in';

  // Build email body based on submission type
  let bodyContent = `A new manuscript has been submitted.\n\n`;
  bodyContent += `Submission Source:\n${sourcePage}\n\n`;
  bodyContent += `Service:\n${service}\n\n`;

  if (userName) {
    bodyContent += `Submitted By:\n${userName}\n\n`;
  }

  if (userEmail) {
    bodyContent += `Email:\n${userEmail}\n\n`;
  }

  if (wordCount) {
    bodyContent += `Word Count:\n${wordCount}\n\n`;
  }

  if (trimSize) {
    bodyContent += `Trim Size:\n${trimSize}\n\n`;
  }

  if (genrePreset) {
    bodyContent += `Genre Preset:\n${genrePreset}\n\n`;
  }

  bodyContent += `Notes:\n${notes || 'No additional notes provided.'}\n\n`;

  if (attachments && attachments.length > 0) {
    bodyContent += `Attachments:\n${attachments.map(a => a.originalname).join('\n')}\n\n`;
  }

  bodyContent += `Submitted At:\n${new Date().toISOString()}`;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: recipient,
    subject: `New Expert Consultation Submission - ${service}`,
    text: bodyContent,
    attachments: attachments.map(file => ({
      filename: file.originalname,
      path: file.path
    }))
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// API Routes

// File upload endpoint
app.post('/api/uploads/manuscript', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({
      success: true,
      file: {
        filename: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'File upload failed' });
  }
});

// Consultation submission endpoint
app.post('/api/submissions', upload.single('file'), async (req, res) => {
  try {
    const {
      sourcePage,
      service,
      userName,
      userEmail,
      wordCount,
      notes,
      trimSize,
      genrePreset
    } = req.body;

    // Validate required fields
    if (!service) {
      return res.status(400).json({ error: 'Service is required' });
    }

    // Prepare attachments array
    let attachments = [];
    if (req.file) {
      attachments.push({
        originalname: req.file.originalname,
        path: req.file.path,
        size: req.file.size
      });
    }

    // Send email with submission details
    await sendConsultationEmail({
      sourcePage,
      service,
      userName,
      userEmail,
      wordCount,
      notes,
      attachments,
      trimSize,
      genrePreset
    });

    // Clean up uploaded file after successful email send
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.json({
      success: true,
      message: 'Submission received successfully',
      data: {
        sourcePage,
        service,
        userName,
        userEmail,
        wordCount,
        notes,
        submittedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Submission error:', error);

    // Clean up file if email failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ error: error.message || 'Submission failed' });
  }
});

// Admin submissions list (for dashboard)
app.get('/api/admin/submissions', async (req, res) => {
  // In a real app, you'd fetch from a database
  // This is a placeholder for the dashboard
  res.json({
    data: []
  });
});

// Protected profile endpoint (placeholder)
app.get('/api/protected/profile', (req, res) => {
  // In a real app, verify Firebase token here
  res.json({
    user: { name: 'Test User', email: 'test@example.com' }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📧 Email recipient: ${process.env.EMAIL_RECIPIENT || '71762305054@cit.edu.in'}`);
});