import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

const MiniGlobeScene = ({ opacity }) => {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.006;
    }
  });

  return (
    <>
      <Float speed={0.8} floatIntensity={0.3}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.2, 3]} />
          <meshBasicMaterial 
            wireframe={true} 
            color="#666666" 
            transparent={true} 
            opacity={opacity} 
          />
        </mesh>
      </Float>
      <ambientLight intensity={0.5} />
    </>
  );
};

export default function MiniGlobe({ size = 160, opacity = 0.5 }) {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas 
        camera={{ position: [0, 0, 3.5], fov: 50 }} 
        gl={{ alpha: true, antialias: true }}
      >
        <MiniGlobeScene opacity={opacity} />
      </Canvas>
    </div>
  );
}
