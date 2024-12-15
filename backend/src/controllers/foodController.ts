import { Request, Response } from 'express';
import Food, { IFood } from '../models/Food';
import { formatResponse } from '../utils/responseFormatter';

export const foodController = {
  getSavedFoods: async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json(formatResponse({
          success: false,
          message: 'User not authenticated'
        }));
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [foods, total] = await Promise.all([
        Food.find({ userId: req.userId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Food.countDocuments({ userId: req.userId })
      ]);

      res.json(formatResponse({
        success: true,
        message: foods.length ? 'Foods retrieved successfully' : 'No foods found',
        data: foods,
        pagination: {
          page,
          limit,
          totalItems: total,
          totalPages: Math.ceil(total / limit)
        }
      }));
    } catch (error) {
      res.status(500).json(formatResponse({
        success: false,
        message: 'Error fetching foods',
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  },

   // Updated saveFood method
   saveFood: async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json(formatResponse({
          success: false,
          message: 'User not authenticated'
        }));
      }

      const { foodId } = req.params; // Get foodId from URL params

      if (!foodId) {
        return res.status(400).json(formatResponse({
          success: false,
          message: 'Food ID is required'
        }));
      }

      // Check if food is already saved
      const existingFood = await Food.findOne({
        userId: req.userId,
        _id: foodId
      });

      if (existingFood) {
        return res.status(400).json(formatResponse({
          success: false,
          message: 'Food already saved'
        }));
      }

      const newFood = new Food({
        _id: foodId, // Use the ID from the scanned food
        ...req.body,
        userId: req.userId
      });

      await newFood.save();

      res.status(201).json(formatResponse({
        success: true,
        message: 'Food saved successfully',
        data: newFood
      }));
    } catch (error) {
      res.status(500).json(formatResponse({
        success: false,
        message: 'Error saving food',
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  },

  deleteFood: async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json(formatResponse({
          success: false,
          message: 'User not authenticated'
        }));
      }

      const food = await Food.findOneAndDelete({
        _id: req.params.id,
        userId: req.userId
      });

      if (!food) {
        return res.status(404).json(formatResponse({
          success: false,
          message: 'Food not found'
        }));
      }

      res.json(formatResponse({
        success: true,
        message: 'Food deleted successfully',
        data: food
      }));
    } catch (error) {
      res.status(500).json(formatResponse({
        success: false,
        message: 'Error deleting food',
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }
};
