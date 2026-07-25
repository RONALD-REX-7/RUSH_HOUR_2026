#!/bin/bash

# Services
cat << 'INNER_EOF' > server/services/citizenService.ts
import { ProblemModel } from '../models/Problem';
import { NotificationModel } from '../models/Notification';

export const citizenService = {
  async getProblems() {
    return await ProblemModel.find({});
  },
  async getProblemById(id: string) {
    return await ProblemModel.findOne({ id });
  },
  async createProblem(data: any) {
    const newProblem = new ProblemModel({
      ...data,
      id: `PRB-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Pending',
      dateSubmitted: new Date().toISOString()
    });
    await newProblem.save();
    
    // Notify admin
    await NotificationModel.create({
      id: `notif-${Date.now()}`,
      userId: 'usr-admin-1',
      type: 'problem_submitted',
      title: 'New Problem Reported',
      message: `"${newProblem.title}" reported in ${newProblem.category}.`,
      timestamp: new Date().toISOString(),
      read: false,
      linkId: newProblem.id,
    });
    return newProblem;
  },
  async updateProblem(id: string, data: any) {
    const updated = await ProblemModel.findOneAndUpdate({ id }, data, { new: true });
    return updated;
  },
  async deleteProblem(id: string) {
    await ProblemModel.findOneAndDelete({ id });
    return true;
  },
  async submitRating(id: string, rating: number, feedback: string) {
    return await ProblemModel.findOneAndUpdate(
      { id },
      { citizenRating: rating, citizenFeedback: feedback },
      { new: true }
    );
  }
};
INNER_EOF

# Controllers
cat << 'INNER_EOF' > server/controllers/citizenController.ts
import { Request, Response, NextFunction } from 'express';
import { citizenService } from '../services/citizenService';

export const getProblems = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await citizenService.getProblems()); } catch (e) { next(e); }
};
export const getProblemById = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await citizenService.getProblemById(req.params.id)); } catch (e) { next(e); }
};
export const createProblem = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(201).json(await citizenService.createProblem(req.body)); } catch (e) { next(e); }
};
export const updateProblem = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await citizenService.updateProblem(req.params.id, req.body)); } catch (e) { next(e); }
};
export const deleteProblem = async (req: Request, res: Response, next: NextFunction) => {
  try { await citizenService.deleteProblem(req.params.id); res.json({ success: true }); } catch (e) { next(e); }
};
export const submitRating = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await citizenService.submitRating(req.params.id, req.body.rating, req.body.feedback)); } catch (e) { next(e); }
};
INNER_EOF

# Routes
cat << 'INNER_EOF' > server/routes/citizenRoutes.ts
import { Router } from 'express';
import { getProblems, getProblemById, createProblem, updateProblem, deleteProblem, submitRating } from '../controllers/citizenController';

const router = Router();
router.get('/problems', getProblems);
router.get('/problems/:id', getProblemById);
router.post('/problems', createProblem);
router.put('/problems/:id', updateProblem);
router.delete('/problems/:id', deleteProblem);
router.post('/problems/:id/rating', submitRating);

export default router;
INNER_EOF

chmod +x generate_backend.sh
./generate_backend.sh
