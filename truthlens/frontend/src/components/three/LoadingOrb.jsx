import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const OrbScene = () => {
  const coreRef = useRef();
  const ringRef = useRef();
  const lightRef = useRef();
  const pointsRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.008;
      const scale = 1 + Math.sin(t * 2.2) * 0.07;
      coreRef.current.scale.set(scale, scale, scale);
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.y -= 0.005;
      ringRef.current.rotation.x += 0.003;
    }

    if (lightRef.current) {
      lightRef.current.position.x = Math.cos(t * 1.5) * 3;
      lightRef.current.position.z = Math.sin(t * 1.5) * 3;
      lightRef.current.position.y = Math.sin(t * 0.8) * 1.5;
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.003;
    }
  });

  const particleCount = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const R = 1.9; // major radius
    const r = 0.08; // minor radius
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * 2 * Math.PI + Math.random() * 0.2;
      const randomAngle = Math.random() * 2 * Math.PI;
      
      const x = (R + r * Math.cos(randomAngle)) * Math.cos(angle);
      const y = r * Math.sin(randomAngle);
      const z = (R + r * Math.cos(randomAngle)) * Math.sin(angle);
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    return pos;
  }, []);

  return (
    <>
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          color="#f0ede8" 
          roughness={0.05} 
          metalness={0.85} 
          transparent={true} 
          opacity={0.85} 
        />
      </mesh>

      <mesh ref={ringRef}>
        <icosahedronGeometry args={[1.55, 3]} />
        <meshBasicMaterial 
          wireframe={true} 
          color="#666666" 
          transparent={true} 
          opacity={0.3} 
        />
      </mesh>

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial 
          size={0.018} 
          color="#666666" 
          transparent 
          opacity={0.6} 
          sizeAttenuation 
        />
      </points>

      <pointLight ref={lightRef} intensity={2} color="#f0ede8" />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#47ff8f" />
    </>
  );
};

export default function LoadingOrb() {
  return (
    <div className="w-[280px] h-[280px] mx-auto">
      <Canvas 
        camera={{ position: [0, 0, 4], fov: 45 }} 
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <OrbScene />
      </Canvas>
    </div>
  );
}
