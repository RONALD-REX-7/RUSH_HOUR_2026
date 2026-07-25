#!/bin/bash

# Entrepreneur
cat << 'INNER_EOF' > server/services/entrepreneurService.ts
import { ProblemModel } from '../models/Problem';
import { NotificationModel } from '../models/Notification';
import { UserModel } from '../models/User';

export const entrepreneurService = {
  async getProblems() {
    return await ProblemModel.find({});
  },
  async acceptProblem(id: string, entrepreneurId: string) {
    const entUser = await UserModel.findOne({ id: entrepreneurId });
    if (!entUser) throw new Error('Entrepreneur not found');
    const updated = await ProblemModel.findOneAndUpdate(
      { id },
      { 
        status: 'Accepted',
        assignedEntrepreneurId: entUser.id,
        assignedEntrepreneurName: entUser.name,
        assignedEntrepreneurAvatar: entUser.avatar,
        acceptedDate: new Date().toISOString()
      },
      { new: true }
    );
    if (updated) {
      await NotificationModel.create({
        id: `notif-${Date.now()}`,
        userId: updated.citizenId,
        type: 'problem_accepted',
        title: 'Problem Accepted!',
        message: `${entUser.name} has accepted your reported problem "${updated.title}".`,
        timestamp: new Date().toISOString(),
        read: false,
        linkId: id,
      });
    }
    return updated;
  },
  async updateStatus(id: string, status: string) {
    const updatePayload: any = { status };
    if (status === 'Solved') updatePayload.solvedDate = new Date().toISOString();
    return await ProblemModel.findOneAndUpdate({ id }, updatePayload, { new: true });
  }
};
INNER_EOF

cat << 'INNER_EOF' > server/controllers/entrepreneurController.ts
import { Request, Response, NextFunction } from 'express';
import { entrepreneurService } from '../services/entrepreneurService';

export const acceptProblem = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await entrepreneurService.acceptProblem(req.params.id, req.body.entrepreneurId)); } catch (e) { next(e); }
};
export const updateProgress = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await entrepreneurService.updateStatus(req.params.id, 'In Progress')); } catch (e) { next(e); }
};
export const completeProblem = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await entrepreneurService.updateStatus(req.params.id, 'Solved')); } catch (e) { next(e); }
};
INNER_EOF

cat << 'INNER_EOF' > server/routes/entrepreneurRoutes.ts
import { Router } from 'express';
import { acceptProblem, updateProgress, completeProblem } from '../controllers/entrepreneurController';

const router = Router();
router.put('/problems/:id/accept', acceptProblem);
router.put('/problems/:id/progress', updateProgress);
router.put('/problems/:id/complete', completeProblem);

export default router;
INNER_EOF

# Admin
cat << 'INNER_EOF' > server/services/adminService.ts
import { ProblemModel } from '../models/Problem';
import { UserModel } from '../models/User';
import { NotificationModel } from '../models/Notification';

export const adminService = {
  async getCitizens() { return await UserModel.find({ role: 'citizen' }); },
  async getEntrepreneurs() { return await UserModel.find({ role: 'entrepreneur' }); },
  async assignProblem(id: string, entrepreneurId: string) {
    const entUser = await UserModel.findOne({ id: entrepreneurId });
    if (!entUser) throw new Error('Entrepreneur not found');
    const updated = await ProblemModel.findOneAndUpdate(
      { id },
      { 
        status: 'In Progress',
        assignedEntrepreneurId: entUser.id,
        assignedEntrepreneurName: entUser.name,
        assignedEntrepreneurAvatar: entUser.avatar,
        acceptedDate: new Date().toISOString()
      },
      { new: true }
    );
    if (updated) {
      await NotificationModel.create({
        id: `notif-${Date.now()}-ent`,
        userId: entUser.id,
        type: 'problem_assigned',
        title: 'New Contract Assigned',
        message: `You have been assigned to solve "${updated.title}".`,
        timestamp: new Date().toISOString(),
        read: false,
        linkId: id,
      });
    }
    return updated;
  }
};
INNER_EOF

cat << 'INNER_EOF' > server/controllers/adminController.ts
import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/adminService';

export const getCitizens = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await adminService.getCitizens()); } catch (e) { next(e); }
};
export const getEntrepreneurs = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await adminService.getEntrepreneurs()); } catch (e) { next(e); }
};
export const assignProblem = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await adminService.assignProblem(req.params.id, req.body.entrepreneurId)); } catch (e) { next(e); }
};
INNER_EOF

cat << 'INNER_EOF' > server/routes/adminRoutes.ts
import { Router } from 'express';
import { getCitizens, getEntrepreneurs, assignProblem } from '../controllers/adminController';

const router = Router();
router.get('/citizens', getCitizens);
router.get('/entrepreneurs', getEntrepreneurs);
router.put('/problems/:id/assign', assignProblem);
// note: using existing route for post /problems/:id/assign mapped to put /admin/problems/:id/assign

export default router;
INNER_EOF

# Chat & Notifications
cat << 'INNER_EOF' > server/services/chatService.ts
import { ChatModel } from '../models/Chat';
export const chatService = {
  async getChats() { return await ChatModel.find({}); },
  async sendChat(data: any) {
    const newChat = new ChatModel({ ...data, id: `msg-${Date.now()}`, timestamp: new Date().toISOString(), read: false });
    return await newChat.save();
  }
};
INNER_EOF
cat << 'INNER_EOF' > server/controllers/chatController.ts
import { Request, Response, NextFunction } from 'express';
import { chatService } from '../services/chatService';
export const getChats = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await chatService.getChats()); } catch (e) { next(e); }
};
export const sendChat = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(201).json(await chatService.sendChat(req.body)); } catch (e) { next(e); }
};
INNER_EOF
cat << 'INNER_EOF' > server/routes/chatRoutes.ts
import { Router } from 'express';
import { getChats, sendChat } from '../controllers/chatController';
const router = Router();
router.get('/', getChats);
router.post('/', sendChat);
export default router;
INNER_EOF

cat << 'INNER_EOF' > server/services/notificationService.ts
import { NotificationModel } from '../models/Notification';
export const notificationService = {
  async getNotifications() { return await NotificationModel.find({}); },
  async markRead(id: string) { return await NotificationModel.findOneAndUpdate({ id }, { read: true }); },
  async markAllRead(userId: string) { return await NotificationModel.updateMany({ userId }, { read: true }); }
};
INNER_EOF
cat << 'INNER_EOF' > server/controllers/notificationController.ts
import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notificationService';
export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await notificationService.getNotifications()); } catch (e) { next(e); }
};
export const markRead = async (req: Request, res: Response, next: NextFunction) => {
  try { await notificationService.markRead(req.params.id); res.json({ success: true }); } catch (e) { next(e); }
};
export const markAllRead = async (req: Request, res: Response, next: NextFunction) => {
  try { await notificationService.markAllRead(req.params.userId); res.json({ success: true }); } catch (e) { next(e); }
};
INNER_EOF
cat << 'INNER_EOF' > server/routes/notificationRoutes.ts
import { Router } from 'express';
import { getNotifications, markRead, markAllRead } from '../controllers/notificationController';
const router = Router();
router.get('/', getNotifications);
router.put('/:id/read', markRead);
router.put('/user/:userId/read-all', markAllRead);
export default router;
INNER_EOF

chmod +x generate_rest.sh
./generate_rest.sh
