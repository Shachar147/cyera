import { Router } from 'express';
import scanRouter from './scan/scan.routes';
import cloudProviderRouter from './cloud-provider/cloud-provider.routes';

const router = Router();

router.use('/scans', scanRouter);
router.use('/cloud-providers', cloudProviderRouter);

export default router;
