import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

// Interactive Node component with animations
function Node({ position, value, isActive, isHighlighted, isComparing, type = 'default', onClick }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  
  // Animation springs
  const { scale, color } = useSpring({
    scale: hovered ? 1.2 : 1,
    color: isActive ? '#ff4444' : 
           isHighlighted ? '#44ff44' : 
           isComparing ? '#ffff44' : 
           hovered ? '#66aaff' : '#4444ff',
    config: { tension: 150, friction: 10 }
  });

  const nodeGeometry = type === 'array' ? 
    <boxGeometry args={[1, 1, 1]} /> :
    <sphereGeometry args={[0.5, 32, 32]} />;

  return (
    <animated.group position={position} scale={scale}>
      <animated.mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        {nodeGeometry}
        <animated.meshStandardMaterial 
          color={color}
          metalness={0.5}
          roughness={0.5}
        />
      </animated.mesh>
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="bottom"
      >
        {value}
      </Text>
    </animated.group>
  );
}

// Animated Edge component
function Edge({ start, end, isHighlighted, isDirected = false }) {
  const { color } = useSpring({
    color: isHighlighted ? '#44ff44' : '#666666',
    config: { tension: 150, friction: 10 }
  });

  const points = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const points = [startVec, endVec];
    
    if (isDirected) {
      const direction = endVec.clone().sub(startVec).normalize();
      const arrowLength = 0.3;
      const arrowPosition = endVec.clone().sub(direction.multiplyScalar(arrowLength));
      points.push(arrowPosition);
    }
    
    return points;
  }, [start, end, isDirected]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} />
    </line>
  );
}

// LinkedList visualization
function LinkedListStructure({ data, visualState, onNodeClick }) {
  const elements = useMemo(() => {
    return data.map((value, index) => {
      const position = [index * 3 - (data.length - 1) * 1.5, 0, 0];
      return {
        position,
        value,
        isActive: visualState.activeNodes.includes(index),
        isHighlighted: visualState.highlightedNodes.includes(index),
        next: index < data.length - 1 ? index + 1 : null
      };
    });
  }, [data, visualState]);

  return (
    <group>
      {elements.map((element, index) => (
        <group key={index}>
          <Node 
            {...element} 
            onClick={() => onNodeClick?.(index)}
          />
          {element.next !== null && (
            <Edge 
              start={element.position}
              end={elements[element.next].position}
              isDirected={true}
              isHighlighted={visualState.highlightedNodes.includes(index)}
            />
          )}
        </group>
      ))}
    </group>
  );
}

// Binary Tree visualization
function TreeStructure({ data, visualState }) {
  const elements = useMemo(() => {
    return data.map((value, index) => {
      const level = Math.floor(Math.log2(index + 1));
      const position = [
        (index - Math.pow(2, level) + 1) * 3,
        -level * 2,
        0
      ];
      return {
        position,
        value,
        isActive: visualState.activeNodes.includes(index),
        isHighlighted: visualState.highlightedNodes.includes(index),
        leftChild: 2 * index + 1 < data.length ? 2 * index + 1 : null,
        rightChild: 2 * index + 2 < data.length ? 2 * index + 2 : null
      };
    });
  }, [data, visualState]);

  return (
    <group position={[0, 4, 0]}>
      {elements.map((element, index) => (
        <group key={index}>
          <Node {...element} />
          {element.leftChild !== null && (
            <Edge 
              start={element.position}
              end={elements[element.leftChild].position}
              isHighlighted={visualState.highlightedNodes.includes(index)}
            />
          )}
          {element.rightChild !== null && (
            <Edge 
              start={element.position}
              end={elements[element.rightChild].position}
              isHighlighted={visualState.highlightedNodes.includes(index)}
            />
          )}
        </group>
      ))}
    </group>
  );
}

// Graph visualization
function GraphStructure({ data, visualState }) {
  const elements = useMemo(() => {
    return data.map((node, index) => {
      const angle = (index / data.length) * Math.PI * 2;
      const radius = 4;
      const position = [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      ];
      return {
        position,
        value: node.value,
        isActive: visualState.activeNodes.includes(index),
        isHighlighted: visualState.highlightedNodes.includes(index),
        connections: node.connections || []
      };
    });
  }, [data, visualState]);

  return (
    <group>
      {elements.map((element, index) => (
        <group key={index}>
          <Node {...element} />
          {element.connections.map((targetIndex, i) => (
            <Edge 
              key={`${index}-${targetIndex}-${i}`}
              start={element.position}
              end={elements[targetIndex].position}
              isDirected={true}
              isHighlighted={
                visualState.highlightedNodes.includes(index) && 
                visualState.highlightedNodes.includes(targetIndex)
              }
            />
          ))}
        </group>
      ))}
    </group>
  );
}

// Main ThreeScene component
function ThreeScene({ 
  structureType, 
  data, 
  visualState,
  onNodeClick 
}) {
  // Camera settings
  const cameraSettings = useMemo(() => {
    switch (structureType) {
      case 'array':
        return { position: [0, 5, 10], fov: 50 };
      case 'linkedList':
        return { position: [0, 5, 15], fov: 50 };
      case 'tree':
        return { position: [0, 5, 20], fov: 60 };
      case 'graph':
        return { position: [0, 0, 15], fov: 50 };
      default:
        return { position: [0, 5, 10], fov: 50 };
    }
  }, [structureType]);

  // Structure selection
  const StructureComponent = useMemo(() => {
    switch (structureType) {
      case 'array':
        return (
          <group position={[-(data.length - 1) * 1.5, 0, 0]}>
            {data.map((value, index) => (
              <Node
                key={index}
                position={[index * 3, 0, 0]}
                value={value}
                type="array"
                isActive={visualState.activeNodes.includes(index)}
                isHighlighted={visualState.highlightedNodes.includes(index)}
                isComparing={visualState.comparisons.includes(index)}
                onClick={() => onNodeClick?.(index)}
              />
            ))}
          </group>
        );
      case 'linkedList':
        return (
          <LinkedListStructure
            data={data}
            visualState={visualState}
            onNodeClick={onNodeClick}
          />
        );
      case 'tree':
        return (
          <TreeStructure
            data={data}
            visualState={visualState}
          />
        );
      case 'graph':
        return (
          <GraphStructure
            data={data}
            visualState={visualState}
          />
        );
      default:
        return null;
    }
  }, [structureType, data, visualState, onNodeClick]);

  return (
    <Canvas
      camera={{
        ...cameraSettings,
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
      
      {StructureComponent}
      
      <gridHelper args={[20, 20, '#444444', '#222222']} />
      <axesHelper args={[5]} />
    </Canvas>
  );
}

export default ThreeScene; 