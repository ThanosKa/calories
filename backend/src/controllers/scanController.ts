import { Request, Response } from 'express';
import FoodGenerator from '../utils/foodGenerator';
import { formatResponse } from '../utils/responseFormatter';

export const scanController = {
  scanFood: async (req: Request, res: Response) => {
    try {
      if (req.file) {
        console.log('Received file:', req.file.originalname);
      }

      const scannedFood = FoodGenerator.generateRandomFood();
      const confidence = Number((0.85 + Math.random() * 0.14).toFixed(2));

      res.json(formatResponse({
        success: true,
        message: 'Food scanned successfully',
        data: {
          food: scannedFood,
          confidence,
          scannedAt: new Date().toISOString()
        }
      }));
    } catch (error) {
      console.error('Scan error:', error);
      res.status(500).json(formatResponse({
        success: false,
        message: 'Error scanning food',
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }
};
