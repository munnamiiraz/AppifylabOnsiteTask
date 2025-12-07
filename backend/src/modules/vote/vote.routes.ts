import { Router } from 'express';
import { VoteController } from './vote.controller';

const router = Router();

router.post('/', VoteController.vote);

export default router;
