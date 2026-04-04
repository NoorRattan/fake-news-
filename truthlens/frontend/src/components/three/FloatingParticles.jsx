import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticlesScene = () => {
  const pointsRef = useRef();
  const particleCount = 800;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60; // -30 to +30
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
      
      const randColor = Math.random();
      if (randColor > 0.3) {
        // Muted #666666
        col[i * 3] = 0.4;
        col[i * 3 + 1] = 0.4;
        col[i * 3 + 2] = 0.4;
      } else if (randColor > 0.05) {
        // Text #f0ede8
        col[i * 3] = 0.941;
        col[i * 3 + 1] = 0.929;
        col[i * 3 + 2] = 0.910;
      } else {
        // Amber #ff9147 to add a touch of warmth
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.568;
        col[i * 3 + 2] = 0.278;
      }
    }
    return [pos, col];
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0003;
      pointsRef.current.rotation.x += 0.0001;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial 
          size={0.06} 
          vertexColors 
          transparent 
          opacity={0.35} 
          sizeAttenuation 
        />
      </points>
      <ambientLight intensity={0.1} />
    </>
  );
};

export default function FloatingParticles() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 30], fov: 75 }} 
        gl={{ alpha: true }}
      >
        <ParticlesScene />
      </Canvas>
    </div>
  );
}
