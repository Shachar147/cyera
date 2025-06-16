import React, { useEffect, useState } from 'react';
import { scansApiService } from '../../services/scans-api-service';
import { HeatmapThresholds } from '../../../../server/src/api/scan/scan.types';
import {getClasses, getHeatmapColorClass} from '../../utils/heatmap-utils';
import styles from './heatmap.module.css';

interface HeatmapProps {
  year?: number;
  cloudProviderIds?: string[];
}

export function Heatmap({ year, cloudProviderIds }: HeatmapProps) {
  const [dailyScanCounts, setDailyScanCounts] = useState<Record<string, number>>({});
  const [heatmapThresholds, setHeatmapThresholds] = useState<HeatmapThresholds | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchDailyScans(){
    setLoading(true);
    setError(null);
    try {
      let countsData: Record<string, number>;
      let thresholdsData: HeatmapThresholds;
      [countsData, thresholdsData] = await Promise.all([
        scansApiService.getDailyScanCounts(year, cloudProviderIds),
        scansApiService.getHeatmapSettings()
      ]);
      setDailyScanCounts(countsData);
      setHeatmapThresholds(thresholdsData);
    } catch (err) {
      console.error("Error fetching daily scan counts or settings:", err);
      setError("Failed to load scan data or settings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => void fetchDailyScans(), [year, cloudProviderIds]);

  if (loading) {
    return <div>Loading heatmap...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  function getEndDate(currentYear: number, year: number) {
    if (year === currentYear) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      yesterday.setHours(23, 59, 59, 999);
      return yesterday;
    } else {
      return new Date(year, 11, 31, 23, 59, 59, 999); // December 31st
    }
  }

  function renderHeatmap() {
    const currentYear = new Date().getFullYear();
    const targetYear = year || currentYear;

    const endDate = getEndDate(currentYear, targetYear);

    // Calculate max daily scans from visible data
    const allScanCounts = Object.values(dailyScanCounts);
    const maxDailyScans = allScanCounts.length > 0 ? Math.max(...allScanCounts) : 0;

    const months = Array.from({ length: 12 }, (_, i) => i); // 0-11 for months
    const heatmapRows: JSX.Element[] = [];

    months.forEach(monthIndex => {
      const daysInMonth: JSX.Element[] = [];
      const firstDayOfMonth = new Date(targetYear, monthIndex, 1);
      let dayIterator = new Date(firstDayOfMonth);

      while (dayIterator.getMonth() === monthIndex && dayIterator <= endDate) {
        const dayKey = dayIterator.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
        const scanCount = dailyScanCounts[dayKey] || 0;
        const colorClass = getHeatmapColorClass(scanCount, maxDailyScans, heatmapThresholds);

        daysInMonth.push(
          <div
            key={dayKey}
            className={getClasses([styles.dayBox, colorClass])}
            title={`${dayKey}: ${scanCount} scans (Max: ${maxDailyScans}, % of Max: ${(scanCount / maxDailyScans * 100).toFixed(2)}%)`}
          />
        );
        dayIterator.setDate(dayIterator.getDate() + 1);
      }

      if (daysInMonth.length > 0) {
        heatmapRows.push(
          <div key={monthIndex} className={styles.monthContainer}>
            {daysInMonth}
          </div>
        );
      }
    });

    return (
      <div className={styles.heatmapContainer}>
        {heatmapRows}
      </div>
    );
  }

  return renderHeatmap();
}
