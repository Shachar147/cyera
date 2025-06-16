import { ScanRepository } from './scan.repository';
import { Scan, FindAllParams } from './scan.types';

export class ScanService {
  private static getDateRangeForYear(year: number): { startDate: Date; endDate: Date } {
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

  static async getScans(year?: number, cloudProviderId?: string): Promise<Scan[]> {
    const params: FindAllParams = {
      filterCallback: (scan: Scan) => {
        // If no filters are provided, return all scans
        if (!year && !cloudProviderId) {
          return true;
        }

        // Apply year filter if provided
        if (year) {
          const { startDate, endDate } = this.getDateRangeForYear(year);
          if (scan.date < startDate || scan.date > endDate) {
            return false;
          }
        }

        // Apply cloudProviderId filter if provided
        if (cloudProviderId && scan.cloudProviderId !== cloudProviderId) {
          return false;
        }

        return true;
      }
    };

    return ScanRepository.findAll(params);
  }
} 