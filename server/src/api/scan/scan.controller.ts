import { Request, Response } from 'express';
import { ScanService } from './scan.service';
import { ScanQueryParams } from './scan.types';

export class ScanController {
  static async getScans(req: Request<{}, {}, {}, ScanQueryParams>, res: Response) {
    try {
      const currentYear = new Date().getFullYear();
      const year = req.query.year ? Number(req.query.year) : currentYear;
      const cloudProviderIds = Array.isArray(req.query.cloudProviderIds)
        ? req.query.cloudProviderIds
        : req.query.cloudProviderIds
        ? [req.query.cloudProviderIds]
        : undefined;

      const scans = await ScanService.getScans(year, cloudProviderIds);
      return res.status(200).json(scans);
    } catch (error) {
      console.error('Error fetching scans:', error);
      return res.status(500).json({ error: 'Failed to fetch scans' });
    }
  }

  static async getDailyScans(req: Request<{}, {}, {}, ScanQueryParams>, res: Response) {
    try {
      const currentYear = new Date().getFullYear();
      const year = req.query.year ? Number(req.query.year) : currentYear;
      const cloudProviderIds = Array.isArray(req.query.cloudProviderIds)
        ? req.query.cloudProviderIds
        : req.query.cloudProviderIds
        ? [req.query.cloudProviderIds]
        : undefined;

      const dailyCounts = await ScanService.getDailyScanCounts(year, cloudProviderIds);
      return res.status(200).json(dailyCounts);
    } catch (error) {
      console.error('Error fetching daily scan counts:', error);
      return res.status(500).json({ error: 'Failed to fetch daily scan counts' });
    }
  }
}
