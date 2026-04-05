import { Router } from 'express';
import { getSummary, getCategoryBreakdown, getMonthlyTrends, getRecentActivity } from '../controllers/dashboard.controller';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.use(requireAuth);

router.get('/summary', getSummary);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/recent-activity', getRecentActivity);
router.get('/monthly-trends', getMonthlyTrends);

export default router;
