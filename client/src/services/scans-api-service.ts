import instance from '../http-client';
import { HeatmapThresholds } from '../../../server/src/api/scan/scan.types';

export const scansApiService = {
  getDailyScanCounts: async (year?: number, cids?: string[]): Promise<Record<string, number>> => {
    const params = new URLSearchParams();
    if (year) {
      params.append('year', year.toString());
    }
    if (cids && cids.length > 0) {
      cids.forEach(id => params.append('cids', id));
    }

    const response = await instance.get(`/api/scans/daily?${params.toString()}`);
    return response.data;
  },

  getHeatmapSettings: async (): Promise<HeatmapThresholds> => {
    const response = await instance.get('/api/scans/settings');
    return response.data;
  },
}; 