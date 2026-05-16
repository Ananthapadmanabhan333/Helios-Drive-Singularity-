"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { TelemetryCard, DecisionConsole } from "@/components/DashboardComponents";
import { TrafficHeatmap, FleetMap } from "@/components/AnalysisComponents";
import {
  Cpu,
  Zap,
  Radio,
  Shield,
  Navigation,
  Settings,
  Bell,
  LayoutGrid,
  Globe,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import Three.js scene to avoid SSR issues
const WorldSim = dynamic(() => import("@/components/WorldSim"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] rounded-xl glass border border-blue-500/20 flex items-center justify-center">
      <p className="text-blue-400 font-mono text-xs animate-pulse tracking-widest uppercase">
        Initializing World Model…
      </p>
    </div>
  ),
});

// ─── Anomaly type ─────────────────────────────────────────────────────────────
interface Anomaly {
  id: number;
  message: string;
}

const ANOMALY_POOL = [
  "Unpredictable Pedestrian at Sector 4-G",
  "Ghost Object Detected — LiDAR Sector 9",
  "Sensor Desync: IMU ↔ Camera +12ms",
  "GPS Spoofing Attempt Blocked",
  "Sudden Deceleration — Vehicle ID 0x3F1",
  "Fog Density Exceeds Perception Threshold",
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [latency, setLatency] = useState(12);
  const [gpuUtil, setGpuUtil] = useState(74);
  const [velocity, setVelocity] = useState(65.4);
  const [heading, setHeading] = useState(284);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([
    { id: 1, message: ANOMALY_POOL[0] },
  ]);

  // Live telemetry simulation
  useEffect(() => {
    const t = setInterval(() => {
      setLatency((v) => Math.max(5, Math.min(45, v + (Math.random() - 0.5) * 3)));
      setGpuUtil((v) => Math.max(40, Math.min(99, v + (Math.random() - 0.5) * 5)));
      setVelocity((v) => Math.max(0, Math.min(120, v + (Math.random() - 0.5) * 2)));
      setHeading((v) => (v + (Math.random() - 0.5) * 4 + 360) % 360);
    }, 800);
    return () => clearInterval(t);
  }, []);

  // Random anomaly injections
  useEffect(() => {
    let counter = 2;
    const t = setInterval(() => {
      if (Math.random() > 0.6) {
        const msg = ANOMALY_POOL[Math.floor(Math.random() * ANOMALY_POOL.length)];
        setAnomalies((prev) => [{ id: counter++, message: msg }, ...prev].slice(0, 3));
      }
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const headingLabel = (deg: number) => {
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return dirs[Math.round(deg / 45) % 8];
  };

  return (
    <main className="min-h-screen bg-black text-white p-5 cyber-grid font-sans selection:bg-blue-500/30 overflow-x-hidden overflow-y-auto">
      {/* ── Header ── */}
      <header className="flex justify-between items-center mb-6 glass p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-xl neon-border">
            <Zap size={22} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter neon-text uppercase italic leading-none">
              HELIOS-DRIVE{" "}
              <span className="text-blue-500">SINGULARITY</span>
            </h1>
            <p className="text-[10px] text-blue-400 font-mono tracking-widest uppercase mt-0.5">
              Autonomous Mobility Intelligence &amp; Synthetic World Infrastructure
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            FLEET ONLINE: 12,842 UNITS
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-4 text-gray-400">
            <Bell
              size={18}
              className="hover:text-white cursor-pointer transition-colors"
            />
            <Settings
              size={18}
              className="hover:text-white cursor-pointer transition-colors"
            />
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 border border-white/20" />
              <span className="text-xs font-bold">OPERATOR_01</span>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-12 gap-5 min-h-[calc(100vh-200px)]">
        {/* Left Sidebar */}
        <div className="col-span-3 flex flex-col gap-5 overflow-hidden">
          <div className="grid grid-cols-2 gap-3">
            <TelemetryCard
              title="Inference Latency"
              value={latency.toFixed(0)}
              unit="ms"
              icon={Cpu}
              trend={-4}
            />
            <TelemetryCard
              title="Sensor Fusion"
              value="0.99"
              unit="sync"
              icon={Radio}
              trend={0.1}
            />
            <TelemetryCard
              title="GPU Utilization"
              value={gpuUtil.toFixed(0)}
              unit="%"
              icon={Zap}
              trend={12}
            />
            <TelemetryCard
              title="Safety Margin"
              value="99.8"
              unit="%"
              icon={Shield}
              trend={0.5}
            />
          </div>

          <div className="flex-1 min-h-0">
            <DecisionConsole />
          </div>

          {/* Occupancy Network */}
          <div className="glass p-4 rounded-xl border border-white/10 shrink-0">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Occupancy Network Status
            </h3>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="text-[10px] font-mono text-gray-500 w-14">
                    VOXEL_L{i}
                  </div>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${88 - i * 12}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-blue-500/60 rounded-full"
                    />
                  </div>
                  <div className="text-[10px] font-mono text-blue-400 w-10 text-right">
                    READY
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center — 3D World & Analysis */}
        <div className="col-span-6 flex flex-col gap-5">
          <div className="relative flex-1 min-h-[400px]">
            <WorldSim />

            {/* HUD overlay */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4 glass px-6 py-3 rounded-full border border-white/10 z-10 shadow-2xl">
              <button
                type="button"
                className="p-2 hover:bg-blue-500/20 rounded-full transition-colors text-blue-400"
                aria-label="Navigation"
              >
                <Navigation size={18} />
              </button>
              <div className="h-5 w-px bg-white/10" />
              <div className="flex items-center gap-8 px-2">
                <div className="text-center">
                  <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">
                    Velocity
                  </p>
                  <p className="text-lg font-black font-mono tabular-nums">
                    {velocity.toFixed(1)}{" "}
                    <span className="text-xs font-normal text-gray-400">mph</span>
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">
                    Heading
                  </p>
                  <p className="text-lg font-black font-mono tabular-nums">
                    {Math.round(heading)}°{" "}
                    <span className="text-xs font-normal text-gray-400">
                      {headingLabel(heading)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="h-5 w-px bg-white/10" />
              <button
                type="button"
                className="p-2 hover:bg-blue-500/20 rounded-full transition-colors text-blue-400"
                aria-label="Grid view"
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
          
          {/* Analysis Components Row */}
          <div className="grid grid-cols-2 gap-5 h-[260px] shrink-0">
            <TrafficHeatmap />
            <FleetMap />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3 flex flex-col gap-5 overflow-hidden">
          {/* World State */}
          <div className="glass p-5 rounded-xl border border-white/10 flex-1 flex flex-col">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <Globe size={15} className="text-blue-400" />
              World State Memory
            </h3>

            <div className="space-y-5 flex-1">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Traffic Density
                  </p>
                  <p className="text-xs font-mono text-white font-bold">
                    MODERATE
                  </p>
                </div>
                <div className="h-1 bg-white/5 rounded-full">
                  <div className="h-full w-2/3 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                </div>
              </div>

              {/* RL Status */}
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 space-y-3">
                <div className="flex items-center gap-2 text-blue-400">
                  <Activity size={13} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Reinforcement Learning
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Policy iteration{" "}
                  <span className="text-white font-bold">#4,281</span> complete.
                  Reward optimized for{" "}
                  <span className="text-white font-bold">SMOOTHNESS</span> &amp;{" "}
                  <span className="text-white font-bold">EFFICIENCY</span>.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <div className="px-2 py-0.5 bg-blue-500/10 rounded text-[9px] text-blue-300 font-mono">
                    MODEL_V4.2
                  </div>
                  <div className="px-2 py-0.5 bg-green-500/10 rounded text-[9px] text-green-300 font-mono">
                    CONVERGED
                  </div>
                </div>
              </div>

              {/* Anomaly feed */}
              <div className="space-y-2">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                  Anomaly Feed
                </p>
                <div className="space-y-2 max-h-[120px] overflow-y-auto">
                  <AnimatePresence initial={false}>
                    {anomalies.map((a) => (
                      <motion.div
                        key={a.id}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-2.5 rounded-lg border border-red-500/20 bg-red-500/5 flex items-start gap-2.5"
                      >
                        <AlertTriangle
                          size={13}
                          className="text-red-400 mt-0.5 shrink-0"
                        />
                        <p className="text-[11px] text-red-200 leading-snug">
                          {a.message}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* BEV Perception Stream */}
          <div className="glass p-4 rounded-xl border border-white/10 h-[160px] relative overflow-hidden shrink-0">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Neural Perception Stream
            </h3>
            <div className="flex items-end gap-0.5 h-16">
              {[...Array(24)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: [
                      `${10 + Math.random() * 30}%`,
                      `${20 + Math.random() * 70}%`,
                      `${10 + Math.random() * 30}%`,
                    ],
                  }}
                  transition={{
                    duration: 1.2 + Math.random() * 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex-1 bg-blue-500/30 rounded-t-sm"
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none flex items-center justify-center">
              <p className="text-[9px] font-mono text-blue-400 uppercase tracking-[0.3em] animate-pulse">
                BEV_INFERENCE_ACTIVE
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="mt-4 flex justify-between items-center text-[10px] text-gray-500 font-mono tracking-widest uppercase">
        <div className="flex gap-8">
          <span>
            LATENCY:{" "}
            <span className="text-gray-300">{latency.toFixed(0)}ms</span>
          </span>
          <span>
            GPU_UTIL:{" "}
            <span className="text-gray-300">{gpuUtil.toFixed(0)}%</span>
          </span>
          <span>FLOPs: 14.2 Exa</span>
          <span>UPTIME: 142:22:18:04</span>
        </div>
        <div className="flex gap-4 items-center">
          <Shield size={11} className="text-green-500" />
          <span>SAFETY_KERNEL: NOMINAL</span>
          <div className="h-3 w-px bg-white/10" />
          <span>SINGULARITY_OS_V1.0</span>
        </div>
      </footer>
    </main>
  );
}
