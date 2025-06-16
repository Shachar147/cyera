import { useState } from 'react';
import instance from './http-client';

export function useCloudProviders(): string[] | undefined {
  const [cloudProviders, setCloudProviders] = useState<string[]>();

  if (cloudProviders === undefined) {
    void loadCloudProviders(setCloudProviders);
  }

  return cloudProviders;
}

async function loadCloudProviders(
  onResponse: (result: string[]) => void
): Promise<void> {
  const response = await instance.get('/api/cloud-providers/');
  onResponse(response.data);
}
