import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config';
import { formatResponse } from '../utils/responseFormatter';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      // Validate required fields
      if (!email || !password || !name) {
        return res.status(400).json(formatResponse({
          success: false,
          message: 'Missing required fields',
          error: {
            email: !email ? 'Email is required' : null,
            password: !password ? 'Password is required' : null,
            name: !name ? 'Name is required' : null
          }
        }));
      }

      // Check existing email
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json(formatResponse({
          success: false,
          message: 'Email already registered'
        }));
      }

      const user = new User({ email, password, name });
      await user.save();

      const token = jwt.sign(
        { userId: user._id },
        config.jwt.secret,
        { expiresIn: config.jwt.expire }
      );

      res.status(201).json(formatResponse({
        success: true,
        message: 'User registered successfully',
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            username: user.username,
            name: user.name
          }
        }
      }));
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json(formatResponse({
        success: false,
        message: 'Error creating user',
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { login, password } = req.body;

      if (!login || !password) {
        return res.status(400).json(formatResponse({
          success: false,
          message: 'Missing required fields',
          error: {
            login: !login ? 'Email or username is required' : null,
            password: !password ? 'Password is required' : null
          }
        }));
      }

      const user = await User.findOne({
        $or: [
          { email: login.toLowerCase() },
          { username: login.toLowerCase() }
        ]
      });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json(formatResponse({
          success: false,
          message: 'Invalid credentials'
        }));
      }

      const token = jwt.sign(
        { userId: user._id },
        config.jwt.secret,
        { expiresIn: config.jwt.expire }
      );

      res.json(formatResponse({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            username: user.username,
            name: user.name
          }
        }
      }));
    } catch (error) {
      res.status(500).json(formatResponse({
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }
};
