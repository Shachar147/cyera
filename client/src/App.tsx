import { useState } from 'react';
import './styles.css';
import { Heatmap } from './components/heatmap/heatmap';
import { YearPicker } from './components/YearPicker';
import { CloudPrivderSelect } from './components/CloudPrivderSelect';
import { useCloudProviders } from './hooks';

export default function App() {
  const cloudProviders = useCloudProviders();
  const [selectedYear, setSelectedYear] = useState<number | undefined>(new Date().getFullYear());
  const [selectedCloudProviderIds, setSelectedCloudProviderIds] = useState<string[]>([]);

  return (
    <div className="app">
      <div className="filters">
        <YearPicker
          disableFuture
          value={selectedYear}
          onChange={setSelectedYear}
        />
        <CloudPrivderSelect
          options={cloudProviders?.map(cp => ({ displayName: cp.name, value: cp.id })) || []}
          onChange={setSelectedCloudProviderIds}
          selectedOptions={selectedCloudProviderIds}
        />
      </div>
      <Heatmap year={selectedYear} cloudProviderIds={selectedCloudProviderIds} />
      {/* e2e example: */}
      <div>Cloud Providers: {cloudProviders?.map(cp => cp.name).join(', ')}</div>
    </div>
  );
}
