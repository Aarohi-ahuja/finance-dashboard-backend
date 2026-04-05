import { Request, Response, NextFunction } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middlewares/auth';

type RecordType = 'INCOME' | 'EXPENSE';

export const getRecords = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, category, type } = req.query as {
      startDate?: string;
      endDate?: string;
      category?: string;
      type?: RecordType;
    };

    const whereClause: any = { isDeleted: false };
    
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date.gte = new Date(startDate);
      if (endDate) whereClause.date.lte = new Date(endDate);
    }
    if (category) whereClause.category = category;
    if (type) whereClause.type = type;

    const records = await prisma.record.findMany({
      where: whereClause,
      orderBy: { date: 'desc' }
    });

    return res.json(records);
  } catch (error) {
    next(error);
  }
};

export const getRecordById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const record = await prisma.record.findFirst({
      where: { id, isDeleted: false }
    });

    if (!record) return res.status(404).json({ error: 'Record not found' });
    
    return res.json(record);
  } catch (error) {
    next(error);
  }
};

export const createRecord = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { amount, type, category, date, description } = req.body;
    const userId = req.user?.id;

    const record = await prisma.record.create({
      data: {
        amount,
        type,
        category,
        date: new Date(date),
        description,
        createdById: userId,
        updatedById: userId
      }
    });

    return res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

export const updateRecord = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const { amount, type, category, date, description } = req.body;
    const userId = req.user?.id;
    
    const record = await prisma.record.findFirst({ where: { id, isDeleted: false } });
    if (!record) return res.status(404).json({ error: 'Record not found' });

    const updated = await prisma.record.update({
      where: { id },
      data: {
        amount,
        type,
        category,
        date: date ? new Date(date) : undefined,
        description,
        updatedById: userId
      }
    });

    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteRecord = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const userId = req.user?.id;
    
    const record = await prisma.record.findFirst({ where: { id, isDeleted: false } });
    if (!record) return res.status(404).json({ error: 'Record not found' });

    await prisma.record.update({
      where: { id },
      data: { isDeleted: true, updatedById: userId }
    });

    return res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    next(error);
  }
};
