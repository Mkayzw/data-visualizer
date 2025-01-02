import { useState, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import Controls from './components/Controls';

// Initial sample data for each structure type
const initialData = {
  array: [5, 2, 8, 1, 9, 3],
  linkedList: [1, 2, 3, 4, 5],
  tree: [1, 2, 3, 4, 5, 6, 7], 
  graph: [
    { value: 1, connections: [1, 2] },
    { value: 2, connections: [0, 2] },
    { value: 3, connections: [0, 1] }
  ]
};

function App() {
  // Data structure state
  const [structureType, setStructureType] = useState('array');
  const [data, setData] = useState(initialData.array);
  
  // Algorithm state
  const [algorithm, setAlgorithm] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [visualState, setVisualState] = useState({
    activeNodes: [],
    highlightedNodes: [],
    comparisons: []
  });

  // Handle structure type change
  const handleStructureTypeChange = (newType) => {
    setStructureType(newType);
    setData(initialData[newType]);
    setAlgorithm(null);
    setVisualState({
      activeNodes: [],
      highlightedNodes: [],
      comparisons: []
    });
  };

  // Handle data input
  const handleDataInput = (input) => {
    try {
      if (structureType === 'array' || structureType === 'linkedList') {
        const newData = input.split(',')
          .map(item => parseInt(item.trim()))
          .filter(n => !isNaN(n));
        setData(newData);
      } else if (structureType === 'tree') {
        const newData = input.split(',')
          .map(item => {
            const trimmed = item.trim();
            return trimmed === 'null' ? null : parseInt(trimmed);
          })
          .filter(n => n !== undefined);
        setData(newData);
      } else if (structureType === 'graph') {
        try {
          const parsed = JSON.parse(input);
          if (parsed.nodes && parsed.edges) {
            const newData = parsed.nodes.map((value, index) => ({
              value,
              connections: parsed.edges
                .filter(([from, to]) => from === index)
                .map(([_, to]) => to)
            }));
            setData(newData);
          }
        } catch (e) {
          console.error('Invalid graph data format');
        }
      }
    } catch (error) {
      console.error('Invalid data input:', error);
    }
  };

  // Handle algorithm selection
  const handleAlgorithmSelect = (algo) => {
    setAlgorithm(algo);
    setIsRunning(false);
    setVisualState({
      activeNodes: [],
      highlightedNodes: [],
      comparisons: []
    });
  };

  // Handle data modifications
  const handleDataModification = useCallback((newData) => {
    setData(newData);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Data Structure Visualizer</h1>
          <p className="text-gray-400">Visualize and understand data structures and algorithms</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Controls
              structureType={structureType}
              setStructureType={handleStructureTypeChange}
              data={data}
              onDataInput={handleDataInput}
              algorithm={algorithm}
              onAlgorithmSelect={handleAlgorithmSelect}
              isRunning={isRunning}
              setIsRunning={setIsRunning}
            />
          </div>
          
          <div className="lg:col-span-3 bg-gray-800 rounded-lg overflow-hidden" style={{ height: '600px' }}>
            <Dashboard
              structureType={structureType}
              data={data}
              algorithm={algorithm}
              visualState={visualState}
              onDataModification={handleDataModification}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 