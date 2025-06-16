import { useState } from 'react';
import instance from './http-client';

interface CloudProvider {
  name: string;
  id: string;
}

export function useCloudProviders(): CloudProvider[] | undefined {
  const [cloudProviders, setCloudProviders] = useState<CloudProvider[]>();

  if (cloudProviders === undefined) {
    void loadCloudProviders(setCloudProviders);
  }

  return cloudProviders;
}

async function loadCloudProviders(
  onResponse: (result: CloudProvider[]) => void
): Promise<void> {
  const response = await instance.get('/api/cloud-providers/');
  onResponse(response.data);
}
