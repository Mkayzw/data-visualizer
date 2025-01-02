import { useState } from 'react';

const algorithmOptions = {
  array: ['bubbleSort', 'quickSort', 'binarySearch'],
  linkedList: ['traverse', 'reverse', 'findMiddle'],
  tree: ['inorder', 'preorder', 'postorder'],
  graph: ['bfs', 'dfs', 'dijkstra']
};

function Controls({
  structureType,
  setStructureType,
  data,
  onDataInput,
  algorithm,
  onAlgorithmSelect,
  isRunning,
  setIsRunning
}) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onDataInput(e.target.value);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-6">
      {/* Structure Type Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Structure Type</label>
        <select
          value={structureType}
          onChange={(e) => setStructureType(e.target.value)}
          className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
        >
          <option value="array">Array</option>
          <option value="linkedList">Linked List</option>
          <option value="tree">Binary Tree</option>
          <option value="graph">Graph</option>
        </select>
      </div>

      {/* Data Input */}
      <div>
        <label className="block text-sm font-medium mb-2">Input Data</label>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter comma-separated values"
          className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
        />
        <p className="text-xs text-gray-400 mt-1">
          Example: {structureType === 'array' || structureType === 'linkedList' 
            ? '1, 2, 3, 4, 5' 
            : structureType === 'tree' 
              ? '1, 2, 3, null, 4' 
              : '{"nodes": [1,2,3], "edges": [[0,1],[1,2]]}'}
        </p>
      </div>

      {/* Algorithm Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Algorithm</label>
        <select
          value={algorithm || ''}
          onChange={(e) => onAlgorithmSelect(e.target.value)}
          className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
        >
          <option value="">Select Algorithm</option>
          {algorithmOptions[structureType]?.map((algo) => (
            <option key={algo} value={algo}>
              {algo.charAt(0).toUpperCase() + algo.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Run Button */}
      <button
        onClick={() => setIsRunning(!isRunning)}
        disabled={!algorithm}
        className={`w-full py-2 px-4 rounded-md ${
          algorithm
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-600 cursor-not-allowed'
        }`}
      >
        {isRunning ? 'Stop' : 'Run Algorithm'}
      </button>

      {/* Current Data Display */}
      <div>
        <label className="block text-sm font-medium mb-2">Current Data</label>
        <div className="bg-gray-700 rounded-md px-3 py-2 text-sm">
          {JSON.stringify(data)}
        </div>
      </div>
    </div>
  );
}

export default Controls; 