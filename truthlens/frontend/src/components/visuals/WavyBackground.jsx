import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Wave = () => {
  const mesh = useRef();
  
  // Custom shader for the organic wavy background
  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#0f0f1a') },
      uColor2: { value: new THREE.Color('#a855f7') },
      uColor3: { value: new THREE.Color('#16162a') },
    },
    vertexShader: `
      varying vec2 vUv;
      varying float vZ;
      uniform float uTime;
      void main() {
        vUv = uv;
        vec3 pos = position;
        float noise = sin(pos.x * 2.0 + uTime) * 0.2 + cos(pos.y * 2.0 + uTime) * 0.2;
        pos.z += noise;
        vZ = noise;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying float vZ;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      void main() {
        float mixVal = smoothstep(-0.2, 0.2, vZ);
        vec3 color = mix(uColor1, uColor2, mixVal);
        color = mix(color, uColor3, vUv.y);
        gl_FragColor = vec4(color, 0.4);
      }
    `,
    transparent: true,
  }), []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.material.uniforms.uTime.value = state.clock.getElapsedTime() * 0.5;
      mesh.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -1, -2]}>
      <planeGeometry args={[20, 20, 64, 64]} />
      <shaderMaterial args={[shaderArgs]} />
    </mesh>
  );
};

const WavyBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-bg-deep pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Wave />
      </Canvas>
    </div>
  );
};

export default WavyBackground;
