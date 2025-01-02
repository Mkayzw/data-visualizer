import { useState, useEffect, useCallback } from 'react'
import ThreeScene from './ThreeScene'
import { algorithms } from '../utils/algorithms'

function Dashboard({ 
  structureType, 
  data, 
  algorithm, 
  visualState,
  onDataModification 
}) {
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)

  // Initialize algorithm steps when algorithm changes
  useEffect(() => {
    if (algorithm && algorithms[structureType]?.[algorithm]) {
      const newSteps = algorithms[structureType][algorithm](data)
      setSteps(newSteps)
      setCurrentStep(0)
      setIsPlaying(false)
    }
  }, [algorithm, data, structureType])

  // Automatic playback
  useEffect(() => {
    let timer
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, 1000 / playbackSpeed)
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false)
    }
    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, steps.length, playbackSpeed])

  // Handle node click for modifications
  const handleNodeClick = useCallback((index) => {
    console.log('Node clicked:', index)
  }, [])

  return (
    <div className="relative h-full">
      <ThreeScene
        structureType={structureType}
        data={data}
        visualState={steps[currentStep] || visualState}
        onNodeClick={handleNodeClick}
      />
      
      {/* Playback Controls */}
      {algorithm && steps.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 bg-gray-900 bg-opacity-75 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">
                {algorithm.charAt(0).toUpperCase() + algorithm.slice(1)}
              </h3>
              <p className="text-sm text-gray-400">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
            
            {/* Speed Control */}
            <div className="flex items-center space-x-2">
              <span className="text-sm">Speed:</span>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-gray-800 rounded px-2 py-1"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={4}>4x</option>
              </select>
            </div>
          </div>

          {/* Step Description */}
          <p className="text-sm mb-4">
            {steps[currentStep]?.description || 'Ready to start'}
          </p>

          {/* Control Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentStep(0)}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
              disabled={currentStep === 0}
            >
              ⏮️ Reset
            </button>
            <button
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
              disabled={currentStep === 0}
            >
              ⏪ Prev
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500"
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
            <button
              onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
              disabled={currentStep === steps.length - 1}
            >
              ⏩ Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard 