"use client";

import React, { useState, useEffect, useRef } from "react";
import { Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TelemetryCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ElementType;
  trend?: number;
}

interface Decision {
  id: number;
  action: string;
  confidence: number;
  time: string;
}

// ─── Telemetry Card ───────────────────────────────────────────────────────────
export const TelemetryCard = ({
  title,
  value,
  unit,
  icon: Icon,
  trend,
}: TelemetryCardProps) => (
  <div className="glass p-4 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all group cursor-default">
    <div className="flex justify-between items-start mb-2">
      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
        <Icon size={20} />
      </div>
      {trend !== undefined && (
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
            trend >= 0
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {trend >= 0 ? "+" : ""}
          {trend}%
        </span>
      )}
    </div>
    <div className="space-y-1">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
        {title}
      </p>
      <div className="flex items-baseline gap-1">
        <h4 className="text-2xl font-bold text-white tracking-tight">{value}</h4>
        <span className="text-xs text-gray-500 font-mono">{unit}</span>
      </div>
    </div>
  </div>
);

// ─── Decision Console ─────────────────────────────────────────────────────────
const ALL_ACTIONS = [
  { action: "LANE_FOLLOW", confidence: 0.99 },
  { action: "OBJECT_AVOIDANCE", confidence: 0.98 },
  { action: "VELOCITY_OPTIMIZATION", confidence: 0.95 },
  { action: "LANE_CHANGE_LEFT", confidence: 0.91 },
  { action: "EMERGENCY_BRAKE", confidence: 0.97 },
  { action: "INCREASE_GAP", confidence: 0.88 },
];

let _idCounter = 4;

export const DecisionConsole = () => {
  const [decisions, setDecisions] = useState<Decision[]>([
    { id: 1, action: "LANE_FOLLOW", confidence: 0.99, time: "16:22:01" },
    { id: 2, action: "OBJECT_AVOIDANCE", confidence: 0.98, time: "16:22:05" },
    { id: 3, action: "VELOCITY_OPTIMIZATION", confidence: 0.95, time: "16:22:10" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 8);
      const template = ALL_ACTIONS[Math.floor(Math.random() * ALL_ACTIONS.length)];
      const newDecision: Decision = {
        id: _idCounter++,
        action: template.action,
        confidence: +(template.confidence - Math.random() * 0.03).toFixed(2),
        time: timeStr,
      };
      setDecisions((prev) => [newDecision, ...prev].slice(0, 6));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass p-5 rounded-xl border border-white/10 h-full overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <Activity size={16} className="text-blue-400" />
          Autonomous Decision Stream
        </h3>
        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
      </div>
      <div className="space-y-3 overflow-y-auto pr-1 flex-1">
        <AnimatePresence initial={false}>
          {decisions.map((d) => (
            <motion.div
              key={d.id}
              initial={{ x: -20, opacity: 0, height: 0 }}
              animate={{ x: 0, opacity: 1, height: "auto" }}
              exit={{ x: 20, opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="p-3 rounded-lg bg-white/5 border border-white/5 flex justify-between items-center hover:bg-white/10 transition-colors"
            >
              <div>
                <p className="text-[10px] text-blue-400 font-mono mb-1">
                  {d.time}
                </p>
                <p className="text-xs font-bold text-white">{d.action}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 mb-1">Confidence</p>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${d.confidence * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-mono text-white">
                    {(d.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
