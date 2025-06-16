import { ScanRepository } from './scan.repository';
import { Scan, ScanFilters, DateRange } from './scan.types';

export class ScanService {
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

  static async getScans(filters?: ScanFilters): Promise<Scan[]> {
    const { year, cloudProviderId } = filters || {};
    const dateRange = year ? this.getDateRangeForYear(year) : undefined;

    return ScanRepository.findAll(dateRange, cloudProviderId);
  }
} 