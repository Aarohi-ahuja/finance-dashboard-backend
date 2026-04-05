import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Catch Zod Validation Errors globally if passed to Next()
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: (err as any).errors.map((e: any) => ({ path: e.path.join('.'), message: e.message }))
    });
  }

  console.error('[Error]:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({ error: message });
};
