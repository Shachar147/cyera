import { Router } from 'express';
import { ScanController } from './scan.controller';

const router = Router();

router.get('/', ScanController.getScans);

export default router; 