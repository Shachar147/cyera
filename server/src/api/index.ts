import { Router } from 'express';
import scanRouter from './scan';
import cloudProviderRouter from './cloud-provider';

const router = Router();

router.use('/scans', scanRouter);
router.use('/cloud-providers', cloudProviderRouter);

export default router;
