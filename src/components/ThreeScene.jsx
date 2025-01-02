import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

function DataLabel({ position, value }) {
  return (
    <Text
      position={[position[0], position[1] + 0.5, position[2]]}
      fontSize={0.5}
      color="white"
      anchorX="center"
      anchorY="bottom"
    >
      {value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}
    </Text>
  );
}

function DataPoints({ data, type }) {
  const points = useMemo(() => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue;
    
    return data.map((point, index) => {
      const x = (index - data.length / 2) * 2;
      const y = 2 + ((point.value - minValue) / range) * 8;
      const z = 0;
      return { 
        position: [x, y, z], 
        value: point.value,
        timestamp: new Date(point.timestamp).toLocaleTimeString()
      };
    });
  }, [data]);

  if (type === 'bars') {
    return (
      <group>
        {points.map((point, i) => (
          <group key={i}>
            <mesh position={point.position}>
              <boxGeometry args={[1.5, point.position[1], 1]} />
              <meshStandardMaterial 
                color={new THREE.Color().setHSL(0.33, 0.8, 0.5)} 
                transparent
                opacity={0.8}
              />
            </mesh>
            <DataLabel position={point.position} value={point.value} />
            <Text
              position={[point.position[0], -0.5, point.position[2]]}
              fontSize={0.4}
              color="white"
              anchorX="center"
              anchorY="top"
              rotation={[-Math.PI / 4, 0, 0]}
            >
              {point.timestamp}
            </Text>
          </group>
        ))}
      </group>
    );
  }

  if (type === 'points') {
    return (
      <group>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attachObject={['attributes', 'position']}
              count={points.length}
              array={new Float32Array(points.flatMap(p => p.position))}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial size={0.5} color="#4CAF50" />
        </points>
        {points.map((point, i) => (
          <DataLabel key={i} position={point.position} value={point.value} />
        ))}
      </group>
    );
  }

  return null;
}

function ThreeScene({ data, type }) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <Canvas
      camera={{ position: [-5, 15, 25], fov: 60 }}
      style={{ height: '600px' }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <DataPoints data={data} type={type} />
      <OrbitControls 
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 2.1}
        enableZoom={true}
        enablePan={true}
      />
      <gridHelper 
        args={[40, 20, '#666666', '#444444']} 
        position={[0, 0, 0]} 
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <Text
          key={i}
          position={[-10, i * 5, 0]}
          fontSize={0.8}
          color="white"
        >
          ${(maxValue * (i / 4)).toLocaleString()}
        </Text>
      ))}
    </Canvas>
  );
}

export default ThreeScene; 