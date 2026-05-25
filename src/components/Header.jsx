import React from 'react';
import { Cpu, Activity, ShieldAlert } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md z-30 select-none">
      {/* Top micro-telemetry line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-sportsGreen via-sportsBlue to-sportsGreen animate-pulse-slow" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Title / Brand Section */}
        <div className="flex flex-col text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-sportsGreen/10 border border-sportsGreen/30 flex items-center justify-center text-sportsGreen shadow-glow-green">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-sportsBlue animate-ping" />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              CricketMind <span className="bg-gradient-to-r from-sportsGreen to-sportsBlue bg-clip-text text-transparent">AI</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-sportsBlue uppercase tracking-[0.15em] mt-1 pl-0.5">
            AI Tactical Cricket Intelligence
          </p>
        </div>

        {/* Live Systems Telemetry Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Active Model Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-sportsGreen/20 bg-sportsGreen/5 text-[11px] text-sportsGreen font-mono font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-sportsGreen glow-dot-green animate-pulse" />
            Core Model: Gemini 3.5
          </div>

          {/* Engine Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-sportsBlue/20 bg-sportsBlue/5 text-[11px] text-sportsBlue font-mono font-bold tracking-wider uppercase">
            <Activity className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
            Threat Matrix: Active
          </div>

          {/* Match State Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-[11px] text-sportsYellow font-mono font-bold tracking-wider uppercase">
            <ShieldAlert className="w-3.5 h-3.5" />
            Situational Pressure: HIGH
          </div>
        </div>
      </div>
    </header>
  );
}
