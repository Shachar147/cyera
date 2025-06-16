import { Request, Response } from 'express';
import { CloudProviderRepository } from './cloud-provider.repository';

export class CloudProviderController {
  static async getCloudProviders(_req: Request, res: Response) {
    const cloudProviders = await CloudProviderRepository.findAll();
    return res.json(cloudProviders);
  }
}
