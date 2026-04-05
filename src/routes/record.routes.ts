import { Router } from 'express';
import { getRecords, getRecordById, createRecord, updateRecord, deleteRecord } from '../controllers/records.controller';
import { requireAuth, requireRoles } from '../middlewares/auth';
import { validateBody, validateQuery } from '../middlewares/validate';
import { createRecordSchema, updateRecordSchema, getRecordsQuerySchema } from '../schemas/record.schema';

const router = Router();

router.use(requireAuth);

router.get('/', validateQuery(getRecordsQuerySchema), getRecords);
router.get('/:id', getRecordById);

router.post('/', requireRoles(['ADMIN']), validateBody(createRecordSchema), createRecord);
router.put('/:id', requireRoles(['ADMIN']), validateBody(updateRecordSchema), updateRecord);
router.delete('/:id', requireRoles(['ADMIN']), deleteRecord);

export default router;
