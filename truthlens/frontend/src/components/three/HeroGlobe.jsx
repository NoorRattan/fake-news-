import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const GlobeScene = () => {
  const wireframeRef = useRef();
  const pointsRef = useRef();

  const particleCount = 600;
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.cbrt(Math.random()) * 1.8;
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      const randColor = Math.random();
      if (randColor < 0.33) {
        // Purple #a855f7
        col[i * 3] = 0.659;
        col[i * 3 + 1] = 0.333;
        col[i * 3 + 2] = 0.969;
      } else if (randColor < 0.66) {
        // Violet #818cf8
        col[i * 3] = 0.506;
        col[i * 3 + 1] = 0.549;
        col[i * 3 + 2] = 0.973;
      } else {
        // Green #4ade80
        col[i * 3] = 0.290;
        col[i * 3 + 1] = 0.871;
        col[i * 3 + 2] = 0.502;
      }
    }
    
    return [pos, col];
  }, []);

  useFrame(({ clock }) => {
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y += 0.004;
      wireframeRef.current.rotation.x += 0.001;
      const scale = 1 + Math.sin(clock.getElapsedTime() * 0.7) * 0.025;
      wireframeRef.current.scale.set(scale, scale, scale);
    }
    
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= 0.002;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.2}>
      <group>
        <mesh ref={wireframeRef}>
          <icosahedronGeometry args={[2.2, 4]} />
          <meshBasicMaterial 
            wireframe={true} 
            color="#a855f7" 
            transparent={true} 
            opacity={0.25} 
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
            <bufferAttribute
              attach="attributes-color"
              count={colors.length / 3}
              array={colors}
              itemSize={3}
            />
          </bufferGeometry>
          <PointMaterial 
            size={0.022} 
            vertexColors 
            transparent 
            opacity={0.75} 
            sizeAttenuation 
          />
        </points>
      </group>
      
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#a855f7" />
      <pointLight position={[-5, -5, -5]} intensity={0.6} color="#818cf8" />
    </Float>
  );
};

export default function HeroGlobe() {
  return (
    <div className="w-full h-[420px] md:h-[520px]">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }} 
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <GlobeScene />
      </Canvas>
    </div>
  );
}
