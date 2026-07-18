import { Router } from 'express';
import { WatchedController } from '../controllers/watched.controller';

const router = Router();
const watchedController = new WatchedController()

router.post('/save', watchedController.save);
router.get('/', watchedController.findAll);
router.get('/:id', watchedController.findById);
router.put('/:id', watchedController.update);
router.delete('/:id', watchedController.delete);

export default router;

