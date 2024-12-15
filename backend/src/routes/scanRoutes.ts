import express, { Router } from 'express';
import { scanController } from '../controllers/scanController';
import { authMiddleware } from '../middleware/authMiddleware';
import multer from 'multer';

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'));
    }
  }
});

const router: Router = express.Router();

// Scan route with authentication and file upload
router.post(
  '/', 
  authMiddleware,
  upload.single('image'),
  scanController.scanFood
);

export default router;
