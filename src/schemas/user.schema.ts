import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional()
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional()
});

export const updateRoleSchema = z.object({
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN'])
});

export const updateStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE'])
});
