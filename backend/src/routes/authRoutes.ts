import express, { Router, Request, Response } from 'express';
import { authController } from '../controllers/authController';

const router: Router = express.Router();

// Define route handlers directly
router.post('/register', async (req: Request, res: Response) => {
    await authController.register(req, res);
});

router.post('/login', async (req: Request, res: Response) => {
    await authController.login(req, res);
});

export default router;
