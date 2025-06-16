import instance from '../http-client';

export const scansApiService = {
  getDailyScanCounts: async (year?: number, cloudProviderIds?: string[]): Promise<Record<string, number>> => {
    const params = new URLSearchParams();
    if (year) {
      params.append('year', year.toString());
    }
    if (cloudProviderIds && cloudProviderIds.length > 0) {
      cloudProviderIds.forEach(id => params.append('cloudProviderIds', id));
    }

    const response = await instance.get(`/api/scans/daily?${params.toString()}`);
    return response.data;
  },
}; 