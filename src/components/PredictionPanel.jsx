import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Eye, Target, Sparkles, AlertTriangle, Key, ShieldCheck, HelpCircle, RefreshCw, Gauge } from 'lucide-react';

export default function PredictionPanel({ prediction, onPredict, apiKey, onSaveApiKey, apiError }) {
  const { delivery, batterReaction, outcome, pressureAnalysis, tacticalInsight, isPredicting } = prediction;
  const [tempKey, setTempKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const handleKeySubmit = (e) => {
    e.preventDefault();
    if (tempKey.trim()) {
      onSaveApiKey(tempKey.trim());
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden select-none">
      {/* Top glowing strip */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sportsGreen to-transparent opacity-50" />
      
      {/* Laser Scanning Effect during active predicting */}
      {isPredicting && <div className="scanline" />}

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
        <div className="flex items-center gap-2">
          <Cpu className="text-sportsGreen w-4 h-4 animate-spin-slow" />
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-300">
            AI Ball-by-Ball Live Predictor
          </h2>
        </div>
        <span className="text-[10px] text-sportsGreen font-mono bg-sportsGreen/10 border border-sportsGreen/20 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
          {apiKey ? 'Predictor Engine Active' : 'Credentials Offline'}
        </span>
      </div>

      {/* Active API Warning / Mode Status */}
      {apiError && (
        <div className="mb-5 flex items-start gap-2.5 p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 text-yellow-400 text-xs leading-relaxed animate-pulse-slow">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold">Offline Simulation:</span> {apiError}. Standard offline high-fidelity simulator has engaged.
          </div>
        </div>
      )}

      {/* RENDER MODE A: API Key configuration Console (If no key exists) */}
      {!apiKey ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center py-6 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-sportsBlue/10 border border-sportsBlue/30 flex items-center justify-center text-sportsBlue mb-4 shadow-glow-blue">
            <Key className="w-6 h-6 animate-pulse" />
          </div>

          <h3 className="text-base font-extrabold text-white tracking-wide">
            AI Cognitive Activation Required
          </h3>
          <p className="text-xs text-slate-400 max-w-[380px] mt-1.5 leading-relaxed">
            Configure your Gemini API key to query live intelligence using your custom match configurations in real-time.
          </p>

          <form onSubmit={handleKeySubmit} className="w-full max-w-[380px] mt-6 flex flex-col gap-3">
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="Paste Gemini API Key here..."
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sportsBlue/50 transition-all duration-300 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-white transition-colors"
              >
                <span className="text-[10px] uppercase font-mono font-bold">
                  {showKey ? 'Hide' : 'Show'}
                </span>
              </button>
            </div>

            <button
              type="submit"
              disabled={!tempKey.trim()}
              className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                tempKey.trim()
                  ? 'bg-gradient-to-r from-sportsBlue to-indigo-500 text-slate-950 font-black shadow-[0_0_15px_rgba(0,229,255,0.3)] border-none'
                  : 'bg-slate-900 text-slate-500 border border-white/5 cursor-not-allowed'
              }`}
            >
              Unlock AI Strategy Engine
            </button>
          </form>

          <div className="mt-5 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Don't have a key? Get a free key at</span>
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sportsBlue hover:underline font-bold"
            >
              Google AI Studio
            </a>
          </div>
        </motion.div>
      ) : (
        /* RENDER MODE B: Prediction Controls (If key exists) */
        <>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 my-6">
            
            {/* Primary predict button */}
            <motion.button
              onClick={onPredict}
              disabled={isPredicting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative group px-8 py-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300 flex-grow max-w-[280px] ${
                isPredicting
                  ? 'bg-slate-900/50 text-slate-400 border border-white/10 cursor-not-allowed'
                  : 'bg-gradient-to-r from-sportsGreen to-sportsBlue text-slate-950 font-black shadow-[0_0_20px_rgba(0,255,135,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] border-none'
              }`}
            >
              <span className="absolute inset-0 w-full h-full rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="flex items-center justify-center gap-2">
                <Zap className={`w-4 h-4 ${isPredicting ? 'animate-pulse' : 'fill-slate-950'}`} />
                {isPredicting ? 'Running Gemini AI...' : 'Predict Next Ball'}
              </span>
            </motion.button>

            {/* Secondary Refresh Prediction Button */}
            <motion.button
              onClick={onPredict}
              disabled={isPredicting || !delivery}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 border ${
                isPredicting || !delivery
                  ? 'bg-slate-950/20 text-slate-600 border-white/5 cursor-not-allowed'
                  : 'bg-slate-900 border-white/10 hover:border-sportsBlue text-white hover:text-sportsBlue shadow-inner'
              }`}
              title="Re-run prediction with updated situational overrides"
            >
              <span className="flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${isPredicting ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </span>
            </motion.button>
          </div>
          
          {/* Quick credentials management */}
          <div className="flex items-center justify-center gap-2 -mt-2 mb-6 text-[9px] text-slate-500 font-mono">
            <span className="flex items-center gap-1 text-sportsGreen font-semibold">
              <ShieldCheck className="w-3 h-3" />
              GEMINI ACTIVE
            </span>
            <span>•</span>
            <button
              onClick={() => onSaveApiKey('')}
              className="hover:text-red-400 underline uppercase"
            >
              Reset API Key
            </button>
          </div>

          {/* Result Cards Block */}
          <div className="relative min-h-[220px]">
            <AnimatePresence mode="wait">
              {isPredicting ? (
                /* Telemetry Loading Simulator overlay */
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md rounded-xl border border-white/10 p-6 z-10 text-center"
                >
                  <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-sportsGreen/10 border-t-sportsGreen animate-spin" />
                    <div className="absolute inset-2 rounded-full border-4 border-sportsBlue/10 border-b-sportsBlue animate-spin-reverse" style={{ animationDuration: '1.5s' }} />
                    <div className="absolute inset-4 rounded-full bg-slate-900 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-sportsGreen animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white font-mono uppercase tracking-widest animate-pulse">
                      Gemini Tactical Scanning...
                    </h4>
                    <div className="flex flex-col gap-1 items-center max-w-[280px]">
                      <div className="w-48 h-1 bg-slate-900 border border-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-sportsGreen to-sportsBlue"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2.2, ease: "easeInOut" }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono uppercase mt-1">
                        Formulating Speed Trajectories & Psychological Indices
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Prediction Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Card 1: Predicted Delivery */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="glass-card rounded-xl p-4 border border-white/5 relative hover:border-sportsGreen/20 transition-colors duration-300 shadow-glow-green"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 rounded bg-sportsGreen/10 text-sportsGreen">
                    <Target className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                    Predicted Delivery
                  </h4>
                </div>
                <p className="text-xs text-white font-semibold leading-relaxed min-h-[48px]">
                  {delivery || 'Awaiting simulation triggers. Click "Predict Next Ball" to calculate delivery paths.'}
                </p>
              </motion.div>

              {/* Card 2: Batter Intent */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="glass-card rounded-xl p-4 border border-white/5 relative hover:border-sportsBlue/20 transition-colors duration-300 shadow-glow-blue"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 rounded bg-sportsBlue/10 text-sportsBlue">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                    Batter Intent
                  </h4>
                </div>
                <p className="text-xs text-white font-semibold leading-relaxed min-h-[48px]">
                  {batterReaction || 'Calculates striker pre-meditations and crease trigger movements.'}
                </p>
              </motion.div>

              {/* Card 3: Probable Outcome */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="glass-card rounded-xl p-4 border border-white/5 relative hover:border-sportsGreen/20 transition-colors duration-300 shadow-glow-green"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 rounded bg-sportsGreen/10 text-sportsGreen">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                    Probable Outcome
                  </h4>
                </div>
                <p className="text-xs text-white font-semibold leading-relaxed min-h-[48px]">
                  {outcome || 'Computes runs scored, boundary thresholds, or leg-side catches.'}
                </p>
              </motion.div>

              {/* Card 4: Pressure Analysis */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="glass-card rounded-xl p-4 border border-white/5 relative hover:border-yellow-500/20 transition-colors duration-300 shadow-glow-blue"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 rounded bg-yellow-500/10 text-yellow-500">
                    <Gauge className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                    Pressure Analysis
                  </h4>
                </div>
                <p className="text-xs text-white font-semibold leading-relaxed min-h-[48px]">
                  {pressureAnalysis || 'Evaluates psychological thresholds and stress-induced errors.'}
                </p>
              </motion.div>

              {/* Card 5: Tactical Reasoning */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="glass-card rounded-xl p-4 border border-white/5 relative hover:border-sportsBlue/20 transition-colors duration-300 shadow-glow-blue sm:col-span-2 lg:col-span-1"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 rounded bg-sportsBlue/10 text-sportsBlue">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                    Tactical Reasoning
                  </h4>
                </div>
                <p className="text-xs text-white font-semibold leading-relaxed min-h-[48px]">
                  {tacticalInsight || 'Bowler matchups, crease angle variations, and exit strategy adjustments.'}
                </p>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
