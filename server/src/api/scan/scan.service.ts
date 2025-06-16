import { ScanRepository } from './scan.repository';
import { Scan, FindAllParams, DateRange, HeatmapThresholds } from './scan.types';
import { ScanCache } from './scan.cache';

export class ScanService {
  private static cache = ScanCache.getInstance();

  private static getDateRangeForYear(year: number): DateRange {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(year, 0, 1); // January 1st

    let endDate: Date;
    if (year === currentYear) {
      // For current year, end date is yesterday
      endDate = new Date();
      endDate.setDate(endDate.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // For other years, end date is December 31st
      endDate = new Date(year, 11, 31, 23, 59, 59, 999);
    }

    return { startDate, endDate };
  }

  static async getScans(year?: number, cloudProviderIds?: string[]): Promise<Scan[]> {
    const currentYear = new Date().getFullYear();
    
    // If querying past years, try to get from cache first
    if (year && year < currentYear) {
      const cachedData = this.cache.get<Scan[]>('getScans', { year, cloudProviderIds });
      if (cachedData) {
        console.log(`[Cache Hit] Returning cached scans data for year ${year}`);
        return cachedData;
      }
    }

    const params: FindAllParams = {
      filterCallback: (scan: Scan) => {
        // If no filters are provided, return all scans
        if (!year && !cloudProviderIds?.length) {
          return true;
        }

        // Apply year filter if provided
        if (year) {
          const { startDate, endDate } = this.getDateRangeForYear(year);
          if (scan.date < startDate || scan.date > endDate) {
            return false;
          }
        }

        // Apply cloudProviderIds filter if provided
        if (cloudProviderIds && cloudProviderIds.length > 0) {
          if (!cloudProviderIds.includes(scan.cloudProviderId)) {
            return false;
          }
        }

        return true;
      }
    };

    const result = await ScanRepository.findAll(params);
    
    // Cache the result only if it's for a past year
    if (year && year < currentYear) {
      console.log(`[Cache Miss] Caching scans data for year ${year}`);
      this.cache.set('getScans', { year, cloudProviderIds }, result);
    }

    return result;
  }

  static async getDailyScanCounts(year?: number, cloudProviderIds?: string[]): Promise<Record<string, number>> {
    const currentYear = new Date().getFullYear();
    const targetYear = year || currentYear;

    // If querying past years, try to get from cache first
    if (targetYear < currentYear) {
      const cachedData = this.cache.get<Record<string, number>>('getDailyScanCounts', { year: targetYear, cloudProviderIds });
      if (cachedData) {
        console.log(`[Cache Hit] Returning cached daily scan counts for year ${targetYear}`);
        return cachedData;
      }
    }

    const { startDate, endDate } = this.getDateRangeForYear(targetYear);

    const allScans = await ScanRepository.findAll({
      filterCallback: (scan: Scan) => {
        if (cloudProviderIds && cloudProviderIds.length > 0) {
          if (!cloudProviderIds.includes(scan.cloudProviderId)) {
            return false;
          }
        }
        // Filter by the date range determined by getDateRangeForYear
        return scan.date >= startDate && scan.date <= endDate;
      }
    });

    const dailyCounts: Record<string, number> = {};

    // Initialize counts for all days in the range to 0
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayKey = currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
      dailyCounts[dayKey] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Populate actual scan counts
    allScans.forEach(scan => {
      const scanDate = new Date(scan.date);
      const dayKey = scanDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
      if (dailyCounts[dayKey] !== undefined) {
        dailyCounts[dayKey]++;
      }
    });

    // Cache the result only if it's for a past year
    if (targetYear < currentYear) {
      console.log(`[Cache Miss] Caching daily scan counts for year ${targetYear}`);
      this.cache.set('getDailyScanCounts', { year: targetYear, cloudProviderIds }, dailyCounts);
    }

    return dailyCounts;
  }

  static async getHeatmapSettings(): Promise<HeatmapThresholds> {
    return {
      threshold1: 0.25,
      threshold2: 0.50,
      threshold3: 0.75,
      threshold4: 1.00,
    };
  }
} 