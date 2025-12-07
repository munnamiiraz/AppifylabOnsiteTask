import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { WorkspaceController } from './workspace.controller';

const router = Router();

router.post('/', authenticate, WorkspaceController.create);
router.get('/', authenticate, WorkspaceController.list);

export default router;
