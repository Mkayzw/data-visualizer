import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useMemo, useRef, useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

// Interactive Node component with animations
function Node({ index, value, isActive, isHighlighted, isComparing, onClick }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const [position, setPosition] = useState([index * 3, 0, 0]);
  
  useEffect(() => {
    setPosition([index * 3, 0, 0]);
  }, [index]);

  const { scale, color, pos } = useSpring({
    scale: hovered ? 1.2 : 1,
    color: isActive ? '#ff4444' : 
           isHighlighted ? '#44ff44' : 
           isComparing ? '#ffff44' : 
           hovered ? '#66aaff' : '#4444ff',
    pos: position,
    config: {
      mass: 1,
      tension: 120,
      friction: 14,
      precision: 0.001
    }
  });

  return (
    <animated.group position={pos}>
      <animated.mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
        scale={scale}
      >
        <boxGeometry args={[1, 1, 1]} />
        <animated.meshStandardMaterial 
          color={color}
          metalness={0.5}
          roughness={0.5}
        />
      </animated.mesh>
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="bottom"
      >
        {value}
      </Text>
    </animated.group>
  );
}

// Main ThreeScene component
function ThreeScene({ 
  structureType, 
  data, 
  visualState,
  onNodeClick 
}) {
  // Get current array state from visualization state
  const currentData = useMemo(() => {
    return visualState?.currentArray?.length > 0 ? visualState.currentArray : data;
  }, [data, visualState]);

  // Find index of original value in current array
  const getIndexInCurrent = (value) => {
    return currentData.indexOf(value);
  };

  // Array visualization
  const ArrayVisualization = useMemo(() => {
    const centerOffset = ((data.length - 1) * 3) / 2;
    
    return (
      <group position={[-centerOffset, 0, 0]}>
        {data.map((value, originalIndex) => {
          const currentIndex = getIndexInCurrent(value);
          return (
            <Node
              key={value} // Use value as key to maintain identity
              index={currentIndex}
              value={value}
              isActive={visualState?.activeNodes?.includes(currentIndex)}
              isHighlighted={visualState?.highlightedNodes?.includes(currentIndex)}
              isComparing={visualState?.comparisons?.includes(currentIndex)}
              onClick={() => onNodeClick?.(currentIndex)}
            />
          );
        })}
      </group>
    );
  }, [data, currentData, visualState, onNodeClick]);

  return (
    <Canvas
      camera={{
        position: [0, 5, 15],
        fov: 50,
        near: 0.1,
        far: 1000,
      }}
      style={{ background: '#1a1a1a', height: '100%' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
      />
      
      {structureType === 'array' && ArrayVisualization}
      
      <gridHelper args={[20, 20, '#444444', '#222222']} />
      <axesHelper args={[5]} />
    </Canvas>
  );
}

export default ThreeScene; 