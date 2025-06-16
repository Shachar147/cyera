import { Router } from 'express';
import { ScanController } from './scan.controller';

const router = Router();

router.get('/', ScanController.getScans);
router.get('/daily', ScanController.getDailyScans);
router.get('/settings', ScanController.getSettings);

export default router; 