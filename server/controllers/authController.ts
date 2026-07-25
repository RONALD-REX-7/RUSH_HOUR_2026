import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, role } = req.body;
    const userData = await authService.loginUser(email, role);
    res.json({ token: userData.token, user: userData });
  } catch (error) {
    res.status(401);
    next(error);
  }
};

export const getProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getUserProfile(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(404);
    next(error);
  }
};
