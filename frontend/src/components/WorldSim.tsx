"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import * as THREE from "three";

// ─── Vehicle ──────────────────────────────────────────────────────────────────
interface VehicleProps {
  position: [number, number, number];
  color: string;
  speed: number;
  offset: number;
}

const Vehicle = ({ position, color, speed, offset }: VehicleProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * speed + offset;
    groupRef.current.position.x = position[0] + Math.sin(t) * 10;
    groupRef.current.position.z = position[2] + Math.cos(t) * 10;
    groupRef.current.rotation.y = t + Math.PI / 2;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[1, 0.5, 2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
        />
      </mesh>
      {/* Headlights */}
      <pointLight
        position={[0, 0, 1.2]}
        intensity={8}
        color="white"
        distance={5}
      />
      {/* Taillights */}
      <pointLight
        position={[0, 0, -1.2]}
        intensity={8}
        color="red"
        distance={5}
      />
    </group>
  );
};

// ─── City Grid ────────────────────────────────────────────────────────────────
const CityGrid = () => {
  const grid = useMemo(
    () => new THREE.GridHelper(100, 20, 0x3b82f6, 0x1e293b),
    []
  );
  return <primitive object={grid} position={[0, -0.5, 0]} />;
};

// ─── Building ─────────────────────────────────────────────────────────────────
interface BuildingProps {
  position: [number, number, number];
  args: [number, number, number];
}

const Building = ({ position, args }: BuildingProps) => {
  const edgesGeo = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(...args)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [args[0], args[1], args[2]]
  );

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={args} />
        <meshStandardMaterial
          color="#1e293b"
          transparent
          opacity={0.25}
        />
      </mesh>
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color="#3b82f6" />
      </lineSegments>
    </group>
  );
};

// ─── Scene ────────────────────────────────────────────────────────────────────
const VEHICLES: VehicleProps[] = [
  { position: [15, 0, 0], color: "#3b82f6", speed: 0.5, offset: 0 },
  { position: [-15, 0, 5], color: "#60a5fa", speed: 0.8, offset: 2 },
  { position: [5, 0, -15], color: "#2563eb", speed: 0.6, offset: 4 },
  { position: [-20, 0, -10], color: "#1d4ed8", speed: 1.2, offset: 1 },
];

const BUILDINGS: Array<{ position: [number, number, number]; args: [number, number, number] }> = [
  { position: [20, 5, 20], args: [5, 10, 5] },
  { position: [-25, 8, 15], args: [6, 16, 6] },
  { position: [15, 6, -20], args: [4, 12, 4] },
  { position: [-10, 4, -25], args: [8, 8, 8] },
];

const Scene = () => (
  <>
    <color attach="background" args={["#050505"]} />
    <Stars
      radius={100}
      depth={50}
      count={5000}
      factor={4}
      saturation={0}
      fade
      speed={1}
    />
    <CityGrid />

    {BUILDINGS.map((b, i) => (
      <Building key={i} {...b} />
    ))}

    {VEHICLES.map((v, i) => (
      <Vehicle key={i} {...v} />
    ))}

    <ambientLight intensity={0.3} />
    <pointLight position={[10, 10, 10]} intensity={1.5} color="#3b82f6" />
    <OrbitControls
      enablePan={false}
      maxPolarAngle={Math.PI / 2.1}
      autoRotate
      autoRotateSpeed={0.4}
    />
    <PerspectiveCamera makeDefault position={[30, 30, 30]} />
  </>
);

// ─── WorldSim ─────────────────────────────────────────────────────────────────
const WorldSim = () => (
  <div className="w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-blue-500/20 glass relative">
    <div className="absolute top-4 left-4 z-10 glass p-2 rounded border border-white/10">
      <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest">
        Synthetic World Model
      </h3>
      <p className="text-[10px] text-gray-400">
        Rendering 4 Autonomous Agents | 60 FPS
      </p>
    </div>
    <Canvas shadows>
      <Scene />
    </Canvas>
  </div>
);

export default WorldSim;
