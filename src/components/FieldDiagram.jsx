import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Hardcoded default coordinates for fielder positions on a standard 400x320 SVG canvas
// Center of pitch is at (200, 160)
const FIELDER_POSITIONS = [
  { id: 'long_on', name: 'Long On', x: 220, y: 285, angle: 80, sector: 'V', desc: 'Saves the straight six, handles heavy drives.' },
  { id: 'long_off', name: 'Long Off', x: 180, y: 285, angle: 100, sector: 'V', desc: 'Protects the off-side boundary, covers straight drives.' },
  { id: 'deep_mid_wicket', name: 'Deep Mid-Wicket', x: 310, y: 240, angle: 45, sector: 'On', desc: 'Primary boundary protection against pull shots & sweeps.' },
  { id: 'deep_backward_square', name: 'Deep Backward Square', x: 350, y: 170, angle: 15, sector: 'On', desc: 'Placed fine to catch top-edged sweeps or hook shots.' },
  { id: 'deep_cover', name: 'Deep Cover', x: 75, y: 220, angle: 145, sector: 'Off', desc: 'Crucial for saving boundaries on cover drives.' },
  { id: 'deep_point', name: 'Deep Point', x: 50, y: 150, angle: 170, sector: 'Off', desc: 'Saves boundaries against cut shots and late cuts.' },
  { id: 'deep_third_man', name: 'Deep Third Man', x: 90, y: 65, angle: 220, sector: 'Off', desc: 'Catches thick edges, protects the third-man boundary.' },
  { id: 'fine_leg', name: 'Deep Fine Leg', x: 320, y: 60, angle: 320, sector: 'On', desc: 'Handles leg-side deflections, glides, and pull shots.' },
  { id: 'mid_wicket', name: 'Mid-Wicket', x: 270, y: 200, angle: 55, sector: 'On', desc: 'Saves quick singles, catches mistimed pull shots.' },
  { id: 'extra_cover', name: 'Extra Cover', x: 120, y: 190, angle: 135, sector: 'Off', desc: 'Stops hard drives, keeps batting pressure high.' },
  { id: 'point', name: 'Point', x: 110, y: 140, angle: 165, sector: 'Off', desc: 'Saves runs on square-cuts, highly active single prevention.' },
  { id: 'slip_1', name: 'First Slip', x: 175, y: 110, angle: 250, sector: 'Off', desc: 'Attacking catcher for outside edges.' },
  { id: 'slip_2', name: 'Second Slip', x: 160, y: 105, angle: 240, sector: 'Off', desc: 'Attacking catcher for wider outside edges.' },
  { id: 'mid_off', name: 'Mid Off', x: 165, y: 220, angle: 110, sector: 'Off', desc: 'Stops off-side push and run, inside the circle.' },
  { id: 'mid_on', name: 'Mid On', x: 235, y: 220, angle: 70, sector: 'On', desc: 'Stops leg-side push and run, inside the circle.' },
  { id: 'square_leg', name: 'Square Leg', x: 290, y: 145, angle: 30, sector: 'On', desc: 'Saves singles, positioned square on the leg side.' },
];

export default function FieldDiagram({ highlightedPositions = [], interactive = true }) {
  const [hoveredField, setHoveredField] = useState(null);

  return (
    <div className="relative w-full aspect-[5/4] max-w-[500px] mx-auto select-none rounded-xl overflow-hidden border border-white/5 bg-slate-950/80 p-2">
      {/* Dynamic Background Telemetry */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      
      {/* Vector Graphics for Cricket Field */}
      <svg
        viewBox="0 0 400 320"
        className="w-full h-full"
      >
        {/* Outer Boundary Oval */}
        <ellipse
          cx="200"
          cy="160"
          rx="180"
          ry="140"
          fill="none"
          stroke="rgba(0, 255, 135, 0.2)"
          strokeWidth="2"
          className="field-cricket"
        />
        <ellipse
          cx="200"
          cy="160"
          rx="176"
          ry="136"
          fill="none"
          stroke="rgba(0, 255, 135, 0.4)"
          strokeWidth="1"
        />

        {/* 30-Yard Circle */}
        <ellipse
          cx="200"
          cy="160"
          rx="95"
          ry="75"
          fill="rgba(0, 229, 255, 0.02)"
          stroke="rgba(0, 229, 255, 0.25)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        {/* The Pitch (Wicket) */}
        <rect
          x="192"
          y="135"
          width="16"
          height="50"
          rx="2"
          fill="rgba(254, 240, 138, 0.2)" // light sandy straw
          stroke="rgba(0, 229, 255, 0.4)"
          strokeWidth="1"
        />

        {/* Crease lines */}
        <line x1="188" y1="140" x2="212" y2="140" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <line x1="188" y1="180" x2="212" y2="180" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

        {/* Bowler Direction Pointer */}
        <path
          d="M 200,210 L 200,195"
          stroke="#00E5FF"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrow)"
        />
        <circle cx="200" cy="210" r="2" fill="#00E5FF" />

        {/* Marker definition for Bowler Arrow */}
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#00E5FF" />
          </marker>
        </defs>

        {/* Bowler Marker Label */}
        <text x="200" y="223" fill="rgba(0, 229, 255, 0.7)" fontSize="8" textAnchor="middle" fontWeight="bold" letterSpacing="1">
          BUMRAH
        </text>

        {/* Batter Position (Striker End) */}
        <circle cx="200" cy="143" r="3.5" fill="#00FF87" className="glow-dot-green animate-pulse" />
        <text x="200" y="130" fill="rgba(0, 255, 135, 0.7)" fontSize="8" textAnchor="middle" fontWeight="bold" letterSpacing="1">
          DHONI
        </text>

        {/* Fielders Plot */}
        {FIELDER_POSITIONS.map((fielder) => {
          const isHighlighted = highlightedPositions.some(
            (pos) => pos.toLowerCase().replace(/[^a-z0-9]/g, '') === fielder.id.toLowerCase().replace(/[^a-z0-9]/g, '')
          );
          const isHovered = hoveredField?.id === fielder.id;

          return (
            <g
              key={fielder.id}
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => interactive && setHoveredField(fielder)}
              onMouseLeave={() => interactive && setHoveredField(null)}
            >
              {/* Highlight Halo Ring */}
              {isHighlighted && (
                <ellipse
                  cx={fielder.x}
                  cy={fielder.y}
                  rx="10"
                  ry="10"
                  fill="none"
                  stroke="#00E5FF"
                  strokeWidth="1.5"
                  className="animate-ping opacity-60"
                />
              )}

              {/* Fielder Node Circle */}
              <circle
                cx={fielder.x}
                cy={fielder.y}
                r={isHighlighted ? 5.5 : isHovered ? 5 : 4}
                fill={isHighlighted ? '#00E5FF' : isHovered ? '#00FF87' : 'rgba(255, 255, 255, 0.4)'}
                stroke={isHighlighted ? 'rgba(0, 229, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)'}
                strokeWidth={isHighlighted || isHovered ? 1.5 : 0}
                className="transition-all duration-300"
              />

              {/* Fielder Text Label (Only visible if hovered or highlighted) */}
              {(isHighlighted || isHovered) && (
                <text
                  x={fielder.x}
                  y={fielder.y - 8}
                  fill={isHighlighted ? '#00E5FF' : '#00FF87'}
                  fontSize="7"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="bg-black/80 px-1 py-0.5 rounded shadow-lg backdrop-blur-sm pointer-events-none"
                >
                  {fielder.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Interactive Tooltip Card at the bottom */}
      <AnimatePresence>
        {hoveredField && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-2 left-2 right-2 p-2.5 rounded-lg border border-sportsBlue/30 bg-slate-950/90 backdrop-blur-md shadow-2xl z-20 pointer-events-none"
          >
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[11px] font-bold text-sportsBlue uppercase tracking-wider">
                Tactical Positioning
              </span>
              <span className="text-[10px] text-white/50 px-1.5 py-0.2 bg-white/5 rounded border border-white/10 uppercase font-mono">
                {hoveredField.sector} side
              </span>
            </div>
            <h4 className="text-xs font-bold text-white">{hoveredField.name}</h4>
            <p className="text-[10px] text-slate-300 leading-relaxed mt-0.5">
              {hoveredField.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Legend */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 text-[9px] text-slate-400 bg-slate-900/60 p-1.5 rounded-lg border border-white/5 backdrop-blur-sm pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sportsGreen" />
          <span>Batter Stance</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sportsBlue" />
          <span>Bowler Target</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <span>Standard Fielder</span>
        </div>
      </div>
    </div>
  );
}
