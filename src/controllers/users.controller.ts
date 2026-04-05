import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../db';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, status: true, createdAt: true }
    });
    return res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, status: true, createdAt: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, role, status } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role, status }
    });
    return res.status(201).json({ id: user.id, email, name, role, status });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const { name } = req.body;
    
    const user = await prisma.user.update({
      where: { id },
      data: { name },
      select: { id: true, email: true, name: true, role: true, status: true }
    });
    return res.json(user);
  } catch (error: any) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'User not found' });
    next(error);
  }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, name: true, role: true, status: true }
    });
    return res.json({ message: 'Role updated', user });
  } catch (error: any) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'User not found' });
    next(error);
  }
};

export const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { status },
      select: { id: true, email: true, name: true, role: true, status: true }
    });
    return res.json({ message: 'Status updated', user });
  } catch (error: any) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'User not found' });
    next(error);
  }
};
