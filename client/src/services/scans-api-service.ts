import instance from '../http-client';

export const scansApiService = {
  getDailyScanCounts: async (year?: number, cloudProviderId?: string): Promise<Record<string, number>> => {
    const params = new URLSearchParams();
    if (year) {
      params.append('year', year.toString());
    }
    if (cloudProviderId) {
      params.append('cloudProviderId', cloudProviderId);
    }

    const response = await instance.get(`/api/scans/daily?${params.toString()}`);
    return response.data;
  },
}; 