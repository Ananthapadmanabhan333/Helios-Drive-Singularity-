"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const TrafficHeatmap = () => {
  return (
    <div className="glass p-4 rounded-xl border border-white/10 h-full relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cognitive Traffic Heatmap</h3>
        <span className="text-[10px] text-blue-400 font-mono">SECTOR_4G</span>
      </div>
      <div className="grid grid-cols-10 grid-rows-10 gap-1 h-[140px]">
        {[...Array(100)].map((_, i) => {
          const intensity = Math.random();
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                backgroundColor: intensity > 0.8 ? 'rgba(239, 68, 68, 0.4)' : intensity > 0.5 ? 'rgba(234, 179, 8, 0.3)' : 'rgba(59, 130, 246, 0.1)' 
              }}
              className="rounded-[1px]"
            />
          );
        })}
      </div>
      <div className="mt-4 flex justify-between text-[8px] text-gray-500 font-bold">
        <span>LOW DENSITY</span>
        <div className="flex-1 mx-4 h-1 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded-full" />
        <span>CRITICAL</span>
      </div>
    </div>
  );
};

export const FleetMap = () => {
  return (
    <div className="glass p-4 rounded-xl border border-white/10 h-full relative overflow-hidden">
       <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Fleet Deployment</h3>
        <div className="flex gap-2">
           <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6]" />
           <div className="h-2 w-2 rounded-full bg-white/20" />
        </div>
      </div>
      <div className="relative h-[140px] bg-blue-900/10 rounded-lg border border-white/5 flex items-center justify-center">
         {/* Simple stylized world map or abstract grid */}
         <div className="absolute inset-0 opacity-20 cyber-grid" />
         <div className="relative w-full h-full">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
                className="absolute h-1.5 w-1.5 rounded-full bg-blue-400"
                style={{ 
                  top: `${Math.random() * 80 + 10}%`,
                  left: `${Math.random() * 80 + 10}%`
                }}
              />
            ))}
         </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
         <div>
            <p className="text-[9px] text-gray-500 uppercase">Active Units</p>
            <p className="text-sm font-bold text-white">12,842</p>
         </div>
         <div>
            <p className="text-[9px] text-gray-500 uppercase">Coverage</p>
            <p className="text-sm font-bold text-white">94.2%</p>
         </div>
      </div>
    </div>
  );
};
