import { RadioGroup } from '@headlessui/react';

function Controls({ visualizationType, setVisualizationType, timeRange, setTimeRange }) {
  const visualizationTypes = [
    { id: 'bars', name: '3D Bars' },
    { id: 'points', name: 'Point Cloud' },
  ];

  const timeRanges = [
    { id: '1d', name: '1 Day' },
    { id: '7d', name: '1 Week' },
    { id: '30d', name: '1 Month' },
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Visualization Controls</h2>
      
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-400">Type</label>
          <RadioGroup value={visualizationType} onChange={setVisualizationType}>
            <div className="mt-2 space-y-2">
              {visualizationTypes.map((type) => (
                <RadioGroup.Option
                  key={type.id}
                  value={type.id}
                  className={({ checked }) =>
                    `${checked ? 'bg-blue-600' : 'bg-gray-700'}
                    relative rounded-lg px-4 py-2 cursor-pointer transition-colors`
                  }
                >
                  {type.name}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-400">Time Range</label>
          <RadioGroup value={timeRange} onChange={setTimeRange}>
            <div className="mt-2 space-y-2">
              {timeRanges.map((range) => (
                <RadioGroup.Option
                  key={range.id}
                  value={range.id}
                  className={({ checked }) =>
                    `${checked ? 'bg-blue-600' : 'bg-gray-700'}
                    relative rounded-lg px-4 py-2 cursor-pointer transition-colors`
                  }
                >
                  {range.name}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}

export default Controls; 