import React, { useState } from 'react';
import { Swords, Gauge, Flame, AlertCircle, Sliders, Check, RefreshCw } from 'lucide-react';

export default function MatchDashboard({ matchData, onUpdateMatchData, winProbability = 45 }) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Local edit states
  const [editForm, setEditForm] = useState({ ...matchData });

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = (e) => {
    e.preventDefault();
    onUpdateMatchData(editForm);
    setIsEditing(false);
  };

  const handleReset = () => {
    setEditForm({ ...matchData });
  };

  // Determine Tension Index based on Win Probability and Required Run Rate
  const rrr = parseFloat(matchData.requiredRunRate) || 0;
  let tensionRating = "MODERATE";
  let tensionColor = "text-sportsGreen";
  
  if (rrr > 14 || winProbability < 25) {
    tensionRating = "CRITICAL THREAT";
    tensionColor = "text-red-500 animate-pulse";
  } else if (rrr > 11 || winProbability < 40) {
    tensionRating = "SEVERE TENSION";
    tensionColor = "text-yellow-400";
  } else if (rrr > 8) {
    tensionRating = "TACTICAL DUEL";
    tensionColor = "text-sportsBlue";
  }

  // Circular gauge parameters
  const radius = 55;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  
  // CSK / Batting team percentage
  const cskPercent = winProbability;
  // MI / Bowling team percentage
  const miPercent = 100 - winProbability;

  const cskOffset = circumference - (cskPercent / 100) * circumference;

  return (
    <div className="w-full flex flex-col gap-5 select-none">
      
      {/* 1. Scoreboard Overview Banner */}
      <div className="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden">
        {/* Glow corner decorations */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-sportsGreen/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-sportsBlue/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Banner Header with Configuration Toggle */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-sportsGreen" />
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-300">
              Live Situational Telemetry
            </h2>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase border transition-all duration-300 ${
              isEditing 
                ? 'bg-sportsBlue/25 border-sportsBlue text-sportsBlue shadow-glow-blue' 
                : 'bg-white/5 border-white/10 text-slate-300 hover:border-sportsBlue/50 hover:text-sportsBlue'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            {isEditing ? 'Close Editor' : 'Configure Situation'}
          </button>
        </div>

        {/* RENDER MODE A: Interactive Context Override Drawer */}
        {isEditing ? (
          <form onSubmit={handleApply} className="bg-slate-950/90 rounded-xl border border-white/10 p-4 mb-4 space-y-4">
            <h4 className="text-[11px] font-bold text-sportsBlue uppercase tracking-wider font-mono flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" /> Overrides Console
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Teams Inputs */}
              <div>
                <label className="text-[9px] uppercase font-mono text-slate-400 block mb-1">Batting Team</label>
                <input
                  type="text"
                  value={editForm.battingTeam}
                  onChange={(e) => handleInputChange('battingTeam', e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-sportsGreen/50"
                />
              </div>
              <div>
                <label className="text-[9px] uppercase font-mono text-slate-400 block mb-1">Bowling Team</label>
                <input
                  type="text"
                  value={editForm.bowlingTeam}
                  onChange={(e) => handleInputChange('bowlingTeam', e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-sportsBlue/50"
                />
              </div>

              {/* Score / Overs */}
              <div>
                <label className="text-[9px] uppercase font-mono text-slate-400 block mb-1">Score (Runs/Wickets)</label>
                <input
                  type="text"
                  value={editForm.score}
                  onChange={(e) => handleInputChange('score', e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-sportsGreen/50"
                />
              </div>
              <div>
                <label className="text-[9px] uppercase font-mono text-slate-400 block mb-1">Overs Completed</label>
                <input
                  type="text"
                  value={editForm.overs}
                  onChange={(e) => handleInputChange('overs', e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-sportsBlue/50"
                />
              </div>

              {/* Target / Needed */}
              <div>
                <label className="text-[9px] uppercase font-mono text-slate-400 block mb-1">Runs Required</label>
                <input
                  type="text"
                  value={editForm.runsNeeded}
                  onChange={(e) => handleInputChange('runsNeeded', e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-sportsGreen/50"
                />
              </div>
              <div>
                <label className="text-[9px] uppercase font-mono text-slate-400 block mb-1">Target Score</label>
                <input
                  type="text"
                  value={editForm.target}
                  onChange={(e) => handleInputChange('target', e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-sportsBlue/50"
                />
              </div>

              {/* Batter / Bowler Names */}
              <div>
                <label className="text-[9px] uppercase font-mono text-slate-400 block mb-1">Striking Batsman</label>
                <input
                  type="text"
                  value={editForm.batter}
                  onChange={(e) => handleInputChange('batter', e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-sportsGreen/50"
                />
              </div>
              <div>
                <label className="text-[9px] uppercase font-mono text-slate-400 block mb-1">Active Bowler</label>
                <input
                  type="text"
                  value={editForm.bowler}
                  onChange={(e) => handleInputChange('bowler', e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-sportsBlue/50"
                />
              </div>

              {/* Stats / RRR */}
              <div>
                <label className="text-[9px] uppercase font-mono text-slate-400 block mb-1">Required Run Rate</label>
                <input
                  type="text"
                  value={editForm.requiredRunRate}
                  onChange={(e) => handleInputChange('requiredRunRate', e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-sportsGreen/50"
                />
              </div>
              <div>
                <label className="text-[9px] uppercase font-mono text-slate-400 block mb-1">Balls Left</label>
                <input
                  type="number"
                  value={editForm.ballsRemaining}
                  onChange={(e) => handleInputChange('ballsRemaining', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-white/5 rounded px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-sportsBlue/50"
                />
              </div>
            </div>

            {/* Editor Console Controls */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300 font-mono font-bold uppercase hover:bg-white/10"
              >
                Reset Form
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-sportsGreen text-slate-950 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-glow-green"
              >
                <Check className="w-3.5 h-3.5" /> Apply Overrides
              </button>
            </div>
          </form>
        ) : null}

        {/* Display Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Bowling Team */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-[10px] text-sportsBlue uppercase tracking-wider font-bold">Bowling</span>
            <h3 className="text-lg font-bold text-white tracking-wide">{matchData.bowlingTeam}</h3>
            <span className="text-xs text-slate-400 font-mono mt-0.5">MI • Target: {matchData.target}</span>
          </div>

          {/* Core Score Display */}
          <div className="flex flex-col items-center bg-slate-900/40 border border-white/5 px-4 py-3 rounded-xl backdrop-blur-sm shadow-inner text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Current Score</span>
            <div className="text-3xl sm:text-4xl font-black text-sportsGreen font-mono mt-0.5 tracking-tight">
              {matchData.score}
            </div>
            <div className="text-xs font-semibold text-slate-300 font-mono mt-1">
              Overs: <span className="text-white">{matchData.overs}</span>
            </div>
          </div>

          {/* Batting Team */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <span className="text-[10px] text-sportsGreen uppercase tracking-wider font-bold">Batting</span>
            <h3 className="text-lg font-bold text-white tracking-wide">{matchData.battingTeam}</h3>
            <span className="text-xs text-slate-400 font-mono mt-0.5">CSK • Target: {matchData.target} runs</span>
          </div>
        </div>

        {/* Quick context summary strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/5">
          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Runs Required</div>
            <div className="text-lg font-extrabold text-white font-mono mt-0.5">{matchData.runsNeeded}</div>
          </div>
          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Balls Left</div>
            <div className="text-lg font-extrabold text-sportsBlue font-mono mt-0.5">{matchData.ballsRemaining}</div>
          </div>
          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Req. Run Rate</div>
            <div className="text-lg font-extrabold text-red-400 font-mono mt-0.5">{matchData.requiredRunRate}</div>
          </div>
          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Curr. Run Rate</div>
            <div className="text-lg font-extrabold text-slate-300 font-mono mt-0.5">{matchData.currentRunRate}</div>
          </div>
        </div>
      </div>

      {/* 2. Advanced SVG Win Pressure Meter Card */}
      <div className="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden">
        <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-sportsGreen" />
          Live Win Pressure Analytics
        </h4>

        <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
          {/* Left Arc Label */}
          <div className="text-center sm:text-left">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">{matchData.battingTeam} Win Probability</span>
            <span className="text-3xl font-black text-sportsGreen font-mono">{cskPercent}%</span>
            <span className="text-[10px] text-slate-500 block font-mono mt-0.5">Chasing Corridor</span>
          </div>

          {/* Central Circular SVG Dial */}
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              {/* Outer track */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                fill="transparent"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth={stroke}
              />
              {/* Bowling Win Arc (Base layer) */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                fill="transparent"
                stroke="#00E5FF"
                strokeWidth={stroke}
                strokeDasharray={circumference}
                className="opacity-20"
              />
              {/* Batting Win Arc (Foreground overlay) */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                fill="transparent"
                stroke="#00FF87"
                strokeWidth={stroke}
                strokeDasharray={circumference}
                strokeDashoffset={cskOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                className="shadow-glow-green"
              />
            </svg>

            {/* Numeric display in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] uppercase font-mono text-slate-400 leading-none">Tension Index</span>
              <span className={`text-[11px] font-black font-mono tracking-wider mt-1 uppercase ${tensionColor}`}>
                {tensionRating}
              </span>
            </div>
          </div>

          {/* Right Arc Label */}
          <div className="text-center sm:text-right">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">{matchData.bowlingTeam} Win Probability</span>
            <span className="text-3xl font-black text-sportsBlue font-mono">{miPercent}%</span>
            <span className="text-[10px] text-slate-500 block font-mono mt-0.5">Defending Corridor</span>
          </div>
        </div>
      </div>

      {/* Head to Head Duel: Batter vs Bowler Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Batsman Card */}
        <div className="glass-card rounded-xl p-4 border border-sportsGreen/10 relative overflow-hidden group hover:border-sportsGreen/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-sportsGreen/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-sportsGreen font-mono uppercase tracking-widest bg-sportsGreen/10 px-2 py-0.5 rounded">
              Striker
            </span>
            <Flame className="w-4 h-4 text-sportsYellow animate-pulse" />
          </div>

          <h3 className="text-base font-extrabold text-white leading-tight">{matchData.batter}</h3>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">{matchData.battingTeam}</p>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5">
            <div>
              <div className="text-[9px] uppercase font-mono text-slate-400">Scorecard</div>
              <div className="text-lg font-bold text-white font-mono">{matchData.batterStats || '42* (18)'}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase font-mono text-slate-400">Strike Rate</div>
              <div className="text-lg font-bold text-sportsGreen font-mono">233.33</div>
            </div>
          </div>
        </div>

        {/* Bowler Card */}
        <div className="glass-card rounded-xl p-4 border border-sportsBlue/10 relative overflow-hidden group hover:border-sportsBlue/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-sportsBlue/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-sportsBlue font-mono uppercase tracking-widest bg-sportsBlue/10 px-2 py-0.5 rounded">
              Active Bowler
            </span>
            <Gauge className="w-4 h-4 text-sportsBlue" />
          </div>

          <h3 className="text-base font-extrabold text-white leading-tight">{matchData.bowler}</h3>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">{matchData.bowlingTeam}</p>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5">
            <div>
              <div className="text-[9px] uppercase font-mono text-slate-400">Match Figure</div>
              <div className="text-lg font-bold text-white font-mono">{matchData.bowlerStats || '3.2-0-28-2'}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase font-mono text-slate-400">Economy</div>
              <div className="text-lg font-bold text-sportsBlue font-mono">8.40</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
