import { HeatmapThresholds } from '../../../server/src/api/scan/scan.types';

export function getHeatmapColorClass(count: number, maxDailyScans: number, heatmapThresholds: HeatmapThresholds | null): string {
  if (count === 0) return 'color1'; // Dark grey for no scans
  if (maxDailyScans === 0) return 'color1'; // All days have 0 scans

  const percentage = count / maxDailyScans;

  if (!heatmapThresholds) return 'color1'; // Fallback if thresholds not loaded

  if (percentage <= heatmapThresholds.threshold1) return 'color2'; // Dark purple
  if (percentage <= heatmapThresholds.threshold2) return 'color3'; // Purple
  if (percentage <= heatmapThresholds.threshold3) return 'color4'; // Light purple
  return 'color5'; // Very light purple
} 