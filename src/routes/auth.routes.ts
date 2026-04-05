import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.get('/me', requireAuth, getMe);

export default router;
