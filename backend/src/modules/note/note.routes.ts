import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { NoteController } from './note.controller';

const router = Router();

router.post('/', authenticate, NoteController.create);
router.put('/:id', authenticate, NoteController.update);
router.delete('/:id', authenticate, NoteController.delete);
router.get('/private', authenticate, NoteController.listPrivate);
router.get('/public', NoteController.listPublic);
router.get('/:id', NoteController.getOne);

export default router;
