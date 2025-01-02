import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Controls from './components/Controls';
import DataSourceSelector from './components/DataSourceSelector';

function App() {
  const [dataSource, setDataSource] = useState('crypto');
  const [visualizationType, setVisualizationType] = useState('bars');
  const [timeRange, setTimeRange] = useState('1d');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">3D Data Visualizer</h1>
          <p className="text-gray-400">Interactive 3D visualization of real-time data</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Controls
              visualizationType={visualizationType}
              setVisualizationType={setVisualizationType}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
            />
            <DataSourceSelector
              dataSource={dataSource}
              setDataSource={setDataSource}
            />
          </div>
          
          <div className="lg:col-span-3 bg-gray-800 rounded-lg overflow-hidden">
            <Dashboard
              dataSource={dataSource}
              visualizationType={visualizationType}
              timeRange={timeRange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 