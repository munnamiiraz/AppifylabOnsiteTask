import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { CompanyController } from './company.controller';

const router = Router();

router.post('/', authenticate, CompanyController.create);
router.get('/', authenticate, CompanyController.list);

export default router;
