import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Play, Sparkles, BookOpen, MapPin, Compass, Lightbulb, ShieldCheck } from 'lucide-react';

const SUGGESTIONS = [
  { label: 'Middle Overs Spin Struggle', text: 'Opponent struggles against spin in middle overs, especially on slow turning tracks.' },
  { label: 'Yorker / Inswing Susceptibility', text: 'Left-handed batter susceptible to inswinging yorkers at the start of the innings.' },
  { label: 'Short Ball Backlift Weakness', text: 'Batter has a high backlift and struggles with quick, steep short-pitch bouncers aimed at the ribcage.' },
];

export default function OpponentLearning({ strategy, onGenerate }) {
  const [inputText, setInputText] = useState('');
  const { weakness, bowling, fielding, tacticalAdvice, counterPlan, isGenerating } = strategy;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onGenerate(inputText);
  };

  const selectSuggestion = (text) => {
    setInputText(text);
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden select-none">
      {/* Top glowing strip */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sportsBlue to-transparent opacity-50" />
      
      {/* Dynamic scanning line during active generation */}
      {isGenerating && <div className="scanline" />}

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-sportsBlue w-4 h-4" />
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-300">
            Opponent Threat Advisor
          </h2>
        </div>
        <span className="text-[10px] text-sportsBlue font-mono bg-sportsBlue/10 border border-sportsBlue/20 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
          Threat Engine Active
        </span>
      </div>

      {/* Strategy Generator Console */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
            Presets:
          </span>
          {SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              type="button"
              onClick={() => selectSuggestion(sug.text)}
              className="text-[10px] px-2.5 py-1 rounded bg-slate-900 border border-white/5 hover:border-sportsBlue/40 text-slate-300 hover:text-sportsBlue font-mono font-medium transition-all duration-300"
            >
              {sug.label}
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isGenerating}
            placeholder="Type or select opponent behavior pattern... (e.g., 'Opponent struggles against spin in middle overs.')"
            rows="3"
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sportsBlue/50 transition-all duration-300 resize-none font-sans shadow-inner"
          />
          {inputText && (
            <button
              type="button"
              onClick={() => setInputText('')}
              className="absolute top-3 right-3 text-[10px] text-slate-500 hover:text-white uppercase font-mono tracking-wider font-semibold"
            >
              clear
            </button>
          )}
        </div>

        {/* Generate Button */}
        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={isGenerating || !inputText.trim()}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
              isGenerating || !inputText.trim()
                ? 'bg-slate-900 text-slate-500 border border-white/5 cursor-not-allowed'
                : 'bg-gradient-to-r from-sportsBlue to-indigo-500 text-slate-950 font-black shadow-[0_0_15px_rgba(0,229,255,0.3)] border-none'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            {isGenerating ? 'Synthesizing Strategy...' : 'Generate Strategy'}
          </motion.button>
        </div>
      </form>

      {/* Result Cards Block */}
      <div className="relative min-h-[220px] mt-6 border-t border-white/5 pt-6">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            /* Cyber Processing Overlay */
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md rounded-xl border border-white/5 p-6 z-10 text-center"
            >
              <div className="relative w-12 h-12 mb-4 flex items-center justify-center text-sportsBlue">
                <BrainCircuit className="w-8 h-8 animate-pulse text-sportsBlue" />
                <div className="absolute inset-0 rounded-full border border-sportsBlue/30 animate-ping opacity-70" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white font-mono uppercase tracking-widest animate-pulse">
                  Systemizing Threat Vectors...
                </h4>
                <div className="flex flex-col gap-1 items-center max-w-[280px]">
                  <div className="w-48 h-1 bg-slate-900 border border-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-sportsBlue to-indigo-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.8, ease: "easeInOut" }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono uppercase mt-1">
                    Running: Stress Indexes & Scoring Corridor Calculations
                  </span>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Tactical Recommendation Board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Card 1: Weakness Analysis */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="glass-card rounded-xl p-4 border border-white/5 relative hover:border-sportsBlue/20 transition-colors duration-300 shadow-glow-blue"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 rounded bg-sportsBlue/10 text-sportsBlue">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                Weakness Analysis
              </h4>
            </div>
            <p className="text-xs text-white leading-relaxed min-h-[48px]">
              {weakness || 'Strategic threat analysis will generate a thorough breakdown of the batter\'s stance and timing anomalies.'}
            </p>
          </motion.div>

          {/* Card 2: Bowling Strategy */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="glass-card rounded-xl p-4 border border-white/5 relative hover:border-sportsBlue/20 transition-colors duration-300 shadow-glow-blue"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 rounded bg-sportsBlue/10 text-sportsBlue">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                Bowling Strategy
              </h4>
            </div>
            <p className="text-xs text-white leading-relaxed min-h-[48px]">
              {bowling || 'Formulates optimal release speeds, lines, lengths, crease angles, and bowler tactics.'}
            </p>
          </motion.div>

          {/* Card 3: Field Placement */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="glass-card rounded-xl p-4 border border-white/5 relative hover:border-sportsBlue/20 transition-colors duration-300 shadow-glow-blue"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 rounded bg-sportsBlue/10 text-sportsBlue">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                Field Placement
              </h4>
            </div>
            <p className="text-xs text-white leading-relaxed min-h-[48px]">
              {fielding || 'Recommends specialized positions to choke single runaways. This lights up the field visualizer.'}
            </p>
          </motion.div>

          {/* Card 4: Captaincy Advice */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="glass-card rounded-xl p-4 border border-white/5 relative hover:border-sportsBlue/20 transition-colors duration-300 shadow-glow-blue"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 rounded bg-sportsBlue/10 text-sportsBlue">
                <Lightbulb className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                Captaincy Advice
              </h4>
            </div>
            <p className="text-xs text-white leading-relaxed min-h-[48px]">
              {tacticalAdvice || 'Captain guidelines on pacing, matchup options, psychological triggers, and escape pathways.'}
            </p>
          </motion.div>

          {/* Card 5: Counter Gameplay Plan */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="glass-card rounded-xl p-4 border border-white/5 relative hover:border-sportsGreen/20 transition-colors duration-300 shadow-glow-green sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 rounded bg-sportsGreen/10 text-sportsGreen">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                Counter Gameplay Plan
              </h4>
            </div>
            <p className="text-xs text-white leading-relaxed min-h-[48px]">
              {counterPlan || 'Anticipates the batsman\'s adaptive counters and maps the bowler\'s proactive responses.'}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
