import { Scan } from './scan.types';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class ScanCache {
  private static instance: ScanCache;
  private cache: Map<string, CacheEntry<any>>;
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): ScanCache {
    if (!ScanCache.instance) {
      ScanCache.instance = new ScanCache();
    }
    return ScanCache.instance;
  }

  private generateKey(method: string, params: any): string {
    return `${method}:${JSON.stringify(params)}`;
  }

  public set<T>(method: string, params: any, data: T): void {
    const key = this.generateKey(method, params);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  public get<T>(method: string, params: any): T | null {
    const key = this.generateKey(method, params);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if cache entry is expired
    if (Date.now() - entry.timestamp > this.CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  public clear(): void {
    this.cache.clear();
  }
} 