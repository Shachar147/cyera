import React, { useEffect, useState } from 'react';
import { scansApiService } from '../services/scans-api-service';
import { HeatmapThresholds } from '../../../server/src/api/scan/scan.types';
import { getHeatmapColorClass } from '../utils/heatmap-utils';

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
      const countsData = await scansApiService.getDailyScanCounts(year, cloudProviderIds);
      const thresholdsData = await scansApiService.getHeatmapSettings();
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

  function renderHeatmap() {
    const currentYear = new Date().getFullYear();
    const targetYear = year || currentYear;

    const getEndDate = (year: number) => {
      if (year === currentYear) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        yesterday.setHours(23, 59, 59, 999);
        return yesterday;
      } else {
        return new Date(year, 11, 31, 23, 59, 59, 999); // December 31st
      }
    };

    const endDate = getEndDate(targetYear);

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
            className={`day-box ${colorClass}`}
            style={{
              width: '15px',
              height: '15px',
              margin: '2px',
              borderRadius: '3px',
            }}
            title={`${dayKey}: ${scanCount} scans (Max: ${maxDailyScans}, % of Max: ${(scanCount / maxDailyScans * 100).toFixed(2)}%)`}
          />
        );
        dayIterator.setDate(dayIterator.getDate() + 1);
      }

      if (daysInMonth.length > 0) {
        heatmapRows.push(
          <div key={monthIndex} style={{ display: 'flex', marginBottom: '4px' }}>
            {daysInMonth}
          </div>
        );
      }
    });

    return (
      <div style={{ padding: '10px', background: 'black', borderRadius: '8px' }}>
        {heatmapRows}
      </div>
    );
  }

  return (
    <div className="heatmap-container">
      {renderHeatmap()}
    </div>
  );
}
