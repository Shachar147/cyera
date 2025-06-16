export interface FindAllParams {
  filterCallback?: (scan: Scan) => boolean;
}

export interface Scan {
  id: string;
  date: Date;
  cloudProviderId: string;
  scanPrivateKey: string;
}

/**
 * Defines the expected query parameters for the GET /scans endpoint
 * All parameters are optional - year defaults to current year if not provided
 */
export interface ScanQueryParams {
  year?: string;
  cloudProviderId?: string;
}