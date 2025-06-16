import './styles.css';
import { Heatmap } from './components/Heatmap';
import { YearPicker } from './components/YearPicker';
import { CloudPrivderSelect } from './components/CloudPrivderSelect';
import { useCloudProviders } from './hooks';

export default function App() {
  const cloudProviders = useCloudProviders();

  return (
    <div className="app">
      <div className="filters">
        <YearPicker
          disableFuture
          // value={}
          // onChange={}
        />
        <CloudPrivderSelect
        // options={}
        // onChange={}
        // selectedOptions={}
        />
      </div>
      <Heatmap />
      {/* e2e example: */}
      <div>Cloud Providers: {cloudProviders?.join(', ')}</div>
    </div>
  );
}
