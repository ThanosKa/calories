import express, { Router, Request, Response } from 'express';
import { foodController } from '../controllers/foodController';
import { authMiddleware } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Define routes with middleware
router.get('/saved', authMiddleware, async (req: Request, res: Response) => {
    await foodController.getSavedFoods(req, res);
});

router.post('/save/:foodId', authMiddleware, async (req: Request, res: Response) => {
    await foodController.saveFood(req, res);
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    await foodController.deleteFood(req, res);
});

export default router;
