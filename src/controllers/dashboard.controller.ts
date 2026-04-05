import { Response, NextFunction } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middlewares/auth';

export const getSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const records = await prisma.record.findMany({ where: { isDeleted: false } });
    
    let totalIncome = 0;
    let totalExpense = 0;

    records.forEach((r: any) => {
      if (r.type === 'INCOME') totalIncome += r.amount;
      else if (r.type === 'EXPENSE') totalExpense += r.amount;
    });

    return res.json({
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBreakdown = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const records = await prisma.record.findMany({ where: { isDeleted: false } });
    
    const breakdown = records.reduce((acc: Record<string, number>, r: any) => {
      acc[r.category] = (acc[r.category] || 0) + r.amount;
      return acc;
    }, {});

    return res.json(breakdown);
  } catch (error) {
    next(error);
  }
};

export const getRecentActivity = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const records = await prisma.record.findMany({
      where: { isDeleted: false },
      orderBy: { date: 'desc' },
      take: 10
    });

    return res.json(records);
  } catch (error) {
    next(error);
  }
};

export const getMonthlyTrends = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const records = await prisma.record.findMany({ where: { isDeleted: false } });
    
    // Group by YYYY-MM
    const trends = records.reduce((acc: Record<string, { income: number; expense: number }>, r: any) => {
      const monthYear = r.date.toISOString().substring(0, 7);
      if (!acc[monthYear]) {
        acc[monthYear] = { income: 0, expense: 0 };
      }
      if (r.type === 'INCOME') acc[monthYear].income += r.amount;
      else if (r.type === 'EXPENSE') acc[monthYear].expense += r.amount;
      return acc;
    }, {});

    return res.json(trends);
  } catch (error) {
    next(error);
  }
};
