import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, updateUserRole, updateUserStatus } from '../controllers/users.controller';
import { validateBody } from '../middlewares/validate';
import { createUserSchema, updateRoleSchema, updateStatusSchema, updateUserSchema } from '../schemas/user.schema';
import { requireAuth, requireRoles } from '../middlewares/auth';

const router = Router();

// Protect ALL user routes for ADMIN only
router.use(requireAuth);
router.use(requireRoles(['ADMIN']));

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', validateBody(createUserSchema), createUser);
router.patch('/:id', validateBody(updateUserSchema), updateUser);
router.patch('/:id/role', validateBody(updateRoleSchema), updateUserRole);
router.patch('/:id/status', validateBody(updateStatusSchema), updateUserStatus);

export default router;
