import { useState } from 'react';
import './styles.css';
import { Heatmap } from './components/Heatmap';
import { YearPicker } from './components/YearPicker';
import { CloudPrivderSelect } from './components/CloudPrivderSelect';
import { useCloudProviders } from './hooks';

export default function App() {
  const cloudProviders = useCloudProviders();
  const [selectedYear, setSelectedYear] = useState<number | undefined>(new Date().getFullYear());
  const [selectedCloudProviderId, setSelectedCloudProviderId] = useState<string | undefined>(undefined);

  return (
    <div className="app">
      <div className="filters">
        <YearPicker
          disableFuture
          value={selectedYear}
          onChange={setSelectedYear}
        />
        <CloudPrivderSelect
          options={cloudProviders?.map(cp => ({ displayName: cp, value: cp })) || []}
          onChange={(values: string[]) => setSelectedCloudProviderId(values[0])}
          selectedOptions={selectedCloudProviderId ? [selectedCloudProviderId] : []}
        />
      </div>
      <Heatmap year={selectedYear} cloudProviderId={selectedCloudProviderId} />
      {/* e2e example: */}
      <div>Cloud Providers: {cloudProviders?.join(', ')}</div>
    </div>
  );
}
