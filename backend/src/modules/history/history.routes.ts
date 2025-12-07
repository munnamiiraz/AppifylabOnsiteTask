import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { HistoryController } from './history.controller';

const router = Router();

router.get('/:noteId', authenticate, HistoryController.list);
router.post('/restore/:historyId', authenticate, HistoryController.restore);

export default router;
