export interface FindAllParams {
  filterCallback?: (scan: Scan) => boolean;
}

export interface Scan {
  id: string;
  date: Date;
  cloudProviderId: string;
  scanSize: number;
  scanPrivateKey: string;
}

/**
 * Used by the service layer to filter scans
 * Both filters are optional - if not provided, all scans will be returned
 */
export interface ScanFilters {
  year?: number;
  cloudProviderIds?: string[];
}

/**
 * Represents a date range for filtering scans
 * Used internally by the service to calculate date boundaries
 */
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

/**
 * Defines the expected query parameters for the GET /scans endpoint
 * All parameters are optional - year defaults to current year if not provided
 */
export interface ScanQueryParams {
  year?: string;
  cloudProviderIds?: string[];
}