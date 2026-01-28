import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Use system temp directory for uploads
const uploadDir = path.join(os.tmpdir(), 'stackfolio-uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // Preserve original filename with timestamp to avoid conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

// File filter - allow all common code files
const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Block potentially dangerous files
  const blockedExtensions = ['.exe', '.dll', '.so', '.dylib', '.bat', '.cmd', '.ps1', '.sh'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (blockedExtensions.includes(ext)) {
    cb(new Error(`File type ${ext} is not allowed`));
    return;
  }

  cb(null, true);
};

// Create multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 100, // Max 100 files at once
  },
});

// Helper to clean up temp files
export const cleanupTempFiles = (files: Express.Multer.File[]) => {
  files.forEach((file) => {
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  });
};
