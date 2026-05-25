import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MatchDashboard from './components/MatchDashboard';
import PredictionPanel from './components/PredictionPanel';
import OpponentLearning from './components/OpponentLearning';
import FieldDiagram from './components/FieldDiagram';
import { ShieldCheck, Database, Award } from 'lucide-react';

const INITIAL_MATCH_DATA = {
  battingTeam: 'Chennai Super Kings',
  bowlingTeam: 'Mumbai Indians',
  score: '178/5',
  overs: '18.2',
  bowler: 'Jasprit Bumrah',
  bowlerStats: '3.2-0-28-2',
  batter: 'MS Dhoni',
  batterStats: '42* (18)',
  requiredRunRate: '12.5',
  currentRunRate: '9.71',
  runsNeeded: '25',
  ballsRemaining: 10,
  target: '203',
};

const OFFLINE_PREDICTIONS = [
  {
    delivery: "Wide Yorker outside off-stump. Speed: 141.6 km/h. Seam angled outwards to slide away.",
    reaction: "Dhoni reaches far across off-stump, drops his shoulders, attempting to slice over backward point.",
    outcome: "1 run. Slashed hard but intercepted by deep point. Excellent boundary-saving dive.",
    pressureAnalysis: "Batter Stress: 85%. Chasing 12.5 RRR causes high tension. Bowler maintains upper hand.",
    tacticalInsight: "Bumrah successfully executed the wide line. Keeping the ball out of Dhoni's hitting arc prevents straight clearing.",
    winProbability: 42,
    highlights: ['point', 'deep_point', 'deep_cover']
  },
  {
    delivery: "Fast, dipping Yorker on middle-and-leg stump. Speed: 144.2 km/h. Tailing in late.",
    reaction: "Dhoni clears his front leg, drops his back knee, and whips a powerful helicopter shot through mid-wicket.",
    outcome: "6 runs! Over deep mid-wicket boundary by 15 meters. Striker exposes bowler's length.",
    pressureAnalysis: "Bowler Stress: 90%. Straight yorkers are high-risk against Dhoni. Crowd roaring makes it intense.",
    tacticalInsight: "Straight full lines are highly dangerous. Dhoni's wrist power clears straight boundaries easily. Shift to wide yorker.",
    winProbability: 60,
    highlights: ['deep_mid_wicket', 'long_on']
  },
  {
    delivery: "Slower Off-Cutter, back of a length. Speed: 121.5 km/h. Heavy off-break turn off pitch.",
    reaction: "Dhoni is deceived by speed change. Pauses pull trigger, hitting it off the toe of the bat.",
    outcome: "Dot ball. Pulled hit bounces short of mid-wicket fielder. Batter showing timing frustration.",
    pressureAnalysis: "Batter Stress: 92%. RRR ticks up. Bowler regains confidence. Heavy single choke.",
    tacticalInsight: "Pace variations are highly effective on this dry track. Speed adjustments throw off Dhoni's downswing timing.",
    winProbability: 35,
    highlights: ['mid_wicket', 'square_leg']
  },
  {
    delivery: "Steep ribcage Bouncer. Speed: 139.8 km/h. Angling direct at the batter's left shoulder.",
    reaction: "Dhoni pivots on back foot, hands high to hook over the fine-leg boundary fence.",
    outcome: "4 runs. Top edge flies fine of deep fine leg. Lucky boundary over first slip.",
    pressureAnalysis: "Match Tension: CRITICAL. Boundary eases pressure slightly for chasers. Bowler under stress.",
    tacticalInsight: "Short boundaries on the leg side make bouncers highly risky. Stick to full, off-stump channels.",
    winProbability: 50,
    highlights: ['fine_leg', 'deep_third_man']
  }
];

export default function App() {
  const [matchData, setMatchData] = useState(INITIAL_MATCH_DATA);
  const [apiKey, setApiKey] = useState('');
  const [apiError, setApiError] = useState(null);
  const [winProbability, setWinProbability] = useState(45);

  // Initialize API Key from Vite environment variables or localStorage
  useEffect(() => {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    const localKey = localStorage.getItem('cricketmind_gemini_key');
    if (envKey) {
      setApiKey(envKey);
    } else if (localKey) {
      setApiKey(localKey);
    }
  }, []);

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('cricketmind_gemini_key', key);
    } else {
      localStorage.removeItem('cricketmind_gemini_key');
    }
    setApiError(null);
  };

  // Prediction Panel State
  const [prediction, setPrediction] = useState({
    delivery: '',
    batterReaction: '',
    outcome: '',
    pressureAnalysis: '',
    tacticalInsight: '',
    isPredicting: false,
  });

  // Opponent Strategy State
  const [strategy, setStrategy] = useState({
    weakness: '',
    bowling: '',
    fielding: '',
    tacticalAdvice: '',
    counterPlan: '',
    isGenerating: false,
  });

  // Field Highlights
  const [highlightedFields, setHighlightedFields] = useState([]);

  // Calculate simulated win probability based on RRR
  const calculateWinProbability = (rrr) => {
    const rate = parseFloat(rrr) || 12;
    if (rate <= 6) return 85;
    if (rate <= 8) return 72;
    if (rate <= 10) return 58;
    if (rate <= 12) return 48;
    if (rate <= 14) return 32;
    if (rate <= 16) return 18;
    return 8;
  };

  // Handle manual override changes from the dashboard editor
  const handleUpdateMatchData = (newData) => {
    setMatchData(newData);
    const calculatedProb = calculateWinProbability(newData.requiredRunRate);
    setWinProbability(calculatedProb);
  };

  // Handles clicking "Predict Next Ball" using live Gemini AI
  const handlePredict = async () => {
    setPrediction((prev) => ({ ...prev, isPredicting: true }));
    setApiError(null);

    const matchPrompt = `You are CricMind AI, an elite IPL strategist and veteran tactical director. Analyze this death-overs T20 situation:
Match Telemetry:
- Batting Team: ${matchData.battingTeam} (CSK striker end)
- Bowling Team: ${matchData.bowlingTeam}
- Current Score: ${matchData.score} (Overs completed: ${matchData.overs})
- Chasing: Target ${matchData.target} runs (${matchData.ballsRemaining} balls left, ${matchData.runsNeeded} needed).
- Required Run Rate: ${matchData.requiredRunRate}
- Bowler: ${matchData.bowler} (Stats: ${matchData.bowlerStats})
- Batter: ${matchData.batter} (Stats: ${matchData.batterStats})

Provide a highly technical next-ball prediction. Use advanced cricket vocabulary (e.g. 'back-of-the-hand slower cutter', 'cramping the batsman on the ribcage', 'clearing the front leg', 'helicopter swing', 'crease depth adjustments'). You MUST respond with a raw JSON object matching the requested schema.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: matchPrompt }]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: 'OBJECT',
                properties: {
                  delivery: { type: 'STRING', description: 'Most likely next delivery type (seam angle, release path, speed in km/h).' },
                  reaction: { type: 'STRING', description: 'Striking batter biomechanical adjustment and intent.' },
                  outcome: { type: 'STRING', description: 'Outcome of the delivery (runs, wickets, boundaries).' },
                  pressure: { type: 'STRING', description: 'Psychological leverage analysis and stress meters.' },
                  insight: { type: 'STRING', description: 'Deep tactical bowler vs batter matchup logic.' },
                  winProbability: { type: 'INTEGER', description: "Current win probability percentage (1 to 100) of the striking/batting team." },
                  fieldHighlights: {
                    type: 'ARRAY',
                    items: { type: 'STRING' },
                    description: "List of 2 to 4 fielder IDs to highlight. Choose from: 'long_on', 'long_off', 'deep_mid_wicket', 'deep_backward_square', 'deep_cover', 'deep_point', 'deep_third_man', 'fine_leg', 'mid_wicket', 'extra_cover', 'point', 'slip_1', 'slip_2', 'mid_off', 'mid_on', 'square_leg'"
                  }
                },
                required: ['delivery', 'reaction', 'outcome', 'pressure', 'insight', 'winProbability', 'fieldHighlights']
              }
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const responseData = await response.json();
      const rawText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!rawText) {
        throw new Error('Empty response from AI engine.');
      }

      const parsedJSON = JSON.parse(rawText.trim());

      setPrediction({
        delivery: parsedJSON.delivery,
        batterReaction: parsedJSON.reaction,
        outcome: parsedJSON.outcome,
        pressureAnalysis: parsedJSON.pressure,
        tacticalInsight: parsedJSON.insight,
        isPredicting: false,
      });

      if (typeof parsedJSON.winProbability === 'number') {
        setWinProbability(parsedJSON.winProbability);
      }

      // Synchronize field highlights
      if (Array.isArray(parsedJSON.fieldHighlights)) {
        setHighlightedFields(parsedJSON.fieldHighlights);
      }

      // Progress Match State
      setMatchData((prev) => {
        const nextOver = parseFloat((parseFloat(prev.overs) + 0.1).toFixed(1));
        const updatedBalls = prev.ballsRemaining - 1;
        
        let runsToAdd = 0;
        const textOutcome = parsedJSON.outcome.toLowerCase();
        if (textOutcome.includes('6 runs') || textOutcome.includes('six')) runsToAdd = 6;
        else if (textOutcome.includes('4 runs') || textOutcome.includes('four')) runsToAdd = 4;
        else if (textOutcome.includes('2 runs') || textOutcome.includes('two')) runsToAdd = 2;
        else if (textOutcome.includes('1 run') || textOutcome.includes('single')) runsToAdd = 1;
        
        const [currRuns, currWickets] = prev.score.split('/').map(Number);
        const nextRuns = currRuns + runsToAdd;
        const nextNeeded = Math.max(0, prev.runsNeeded - runsToAdd);
        
        return {
          ...prev,
          score: `${nextRuns}/${currWickets}`,
          overs: nextOver.toString(),
          ballsRemaining: updatedBalls,
          runsNeeded: nextNeeded.toString(),
          requiredRunRate: updatedBalls > 0 ? ((nextNeeded / updatedBalls) * 6).toFixed(2) : '0.00',
        };
      });

    } catch (err) {
      console.warn("Gemini API Error, falling back to simulated data:", err.message);
      setApiError(err.message);
      
      // Safe offline fallback
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * OFFLINE_PREDICTIONS.length);
        const scenario = OFFLINE_PREDICTIONS[randomIndex];
        
        setPrediction({
          delivery: scenario.delivery,
          batterReaction: scenario.batterReaction,
          outcome: scenario.outcome,
          pressureAnalysis: scenario.pressureAnalysis,
          tacticalInsight: scenario.tacticalInsight,
          isPredicting: false,
        });

        setWinProbability(scenario.winProbability);
        setHighlightedFields(scenario.highlights);

        // Progress Match State
        setMatchData((prev) => {
          const nextOver = parseFloat((parseFloat(prev.overs) + 0.1).toFixed(1));
          const updatedBalls = prev.ballsRemaining - 1;
          
          let runsToAdd = 0;
          if (scenario.outcome.includes("6 runs")) runsToAdd = 6;
          else if (scenario.outcome.includes("4 runs")) runsToAdd = 4;
          else if (scenario.outcome.includes("1 run")) runsToAdd = 1;
          
          const [currRuns, currWickets] = prev.score.split('/').map(Number);
          const nextRuns = currRuns + runsToAdd;
          const nextNeeded = Math.max(0, prev.runsNeeded - runsToAdd);
          
          return {
            ...prev,
            score: `${nextRuns}/${currWickets}`,
            overs: nextOver.toString(),
            ballsRemaining: updatedBalls,
            runsNeeded: nextNeeded.toString(),
            requiredRunRate: updatedBalls > 0 ? ((nextNeeded / updatedBalls) * 6).toFixed(2) : '0.00',
          };
        });
      }, 1500);
    }
  };

  // Handles generating strategy in Opponent Learning Mode
  const handleGenerateStrategy = async (inputText) => {
    setStrategy((prev) => ({ ...prev, isGenerating: true }));

    // If API key is not present, fall back directly to local matching templates
    if (!apiKey) {
      setTimeout(() => {
        runOfflineStrategy(inputText);
      }, 1500);
      return;
    }

    const strategyPrompt = `You are CricMind AI, a veteran tactical director specializing in IPL coaching strategies. Analyze this observed opponent behavior:
Behavior details: "${inputText}"
Match telemetry: ${matchData.batter} (striking batsman) vs ${matchData.bowler} in T20 death overs.

Generate a comprehensive tactical strategy to exploit this behavior. Return your output as a strictly formatted JSON object matching the requested schema. Use sophisticated coaching terminology (e.g. 'trigger movements', 'corridor compression', 'crease depth trap').`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: strategyPrompt }]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: 'OBJECT',
                properties: {
                  weakness: { type: 'STRING', description: 'Biomechanical or psychological breakdown of this behavior pattern.' },
                  bowling: { type: 'STRING', description: 'Line, length, release angles, crease variations to exploit this.' },
                  fielding: { type: 'STRING', description: 'Fielder configurations, boundary traps, and single chokes.' },
                  tacticalAdvice: { type: 'STRING', description: "Captaincy checklists and bowler psychological tricks." },
                  counterPlan: { type: 'STRING', description: "Anticipating the batsman's counter-adjustments and mapping bowler counter-responses." },
                  fieldHighlights: {
                    type: 'ARRAY',
                    items: { type: 'STRING' },
                    description: "List of 2 to 4 fielder IDs to highlight. Choose from: 'long_on', 'long_off', 'deep_mid_wicket', 'deep_backward_square', 'deep_cover', 'deep_point', 'deep_third_man', 'fine_leg', 'mid_wicket', 'extra_cover', 'point', 'slip_1', 'slip_2', 'mid_off', 'mid_on', 'square_leg'"
                  }
                },
                required: ['weakness', 'bowling', 'fielding', 'tacticalAdvice', 'counterPlan', 'fieldHighlights']
              }
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error('Strategy API error');
      }

      const responseData = await response.json();
      const rawText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!rawText) {
        throw new Error('Empty response');
      }

      const parsedJSON = JSON.parse(rawText.trim());

      setStrategy({
        weakness: parsedJSON.weakness,
        bowling: parsedJSON.bowling,
        fielding: parsedJSON.fielding,
        tacticalAdvice: parsedJSON.tacticalAdvice,
        counterPlan: parsedJSON.counterPlan,
        isGenerating: false,
      });

      if (Array.isArray(parsedJSON.fieldHighlights)) {
        setHighlightedFields(parsedJSON.fieldHighlights);
      }

    } catch (err) {
      console.warn("Strategy AI generation failed, using local templates:", err.message);
      runOfflineStrategy(inputText);
    }
  };

  // Helper function for local matching fallback strategy
  const runOfflineStrategy = (inputText) => {
    const lowerInput = inputText.toLowerCase();

    if (lowerInput.includes('spin') || lowerInput.includes('spinner') || lowerInput.includes('turning')) {
      setStrategy({
        weakness: 'Batter struggles to read release speed on spinning deliveries. Tends to over-commit onto the front foot early, leaving an exploitable gate.',
        bowling: 'Introduce slow flighted off-spin/leg-spin. Pitch full outside off-stump (83 km/h) to invite driving, followed by a turning googly/slider.',
        fielding: 'Choke single opportunities with close fielders. Highlighted: First Slip, Square Leg, Mid-Wicket, and Deep Mid-Wicket for catching.',
        tacticalAdvice: 'Starve the batter of runs for 3-4 consecutive deliveries to force a reckless lofted strike. Hold the line, be patient.',
        counterPlan: 'Batter will likely sweep to disrupt length. Bowler should adjust by sliding a fast googly flatter and wider outside off.',
        isGenerating: false,
      });
      setHighlightedFields(['slip_1', 'square_leg', 'mid_wicket', 'deep_mid_wicket']);
    } else if (lowerInput.includes('short') || lowerInput.includes('bouncer') || lowerInput.includes('pace') || lowerInput.includes('pull')) {
      setStrategy({
        weakness: 'Batter maintains a high backlift and slow reaction hands on chest-high fast deliveries. Gets cramped for pull-shot space.',
        bowling: 'Bowl heavy fast deliveries (138+ km/h) targeted directly at the ribcage/body. Use over-the-wicket angles to maximize body cramping.',
        fielding: 'Leg-side boundary defensive trap. Highlighted: Deep Backward Square, Deep Fine Leg, and Deep Mid-Wicket for boundary catches.',
        tacticalAdvice: 'Deliver two dot balls on off-stump length, then surprise the batter with a fast body-line bouncer. Excellent mental setup.',
        counterPlan: 'Batter will attempt to back away to expose the off side. Bowler should follow the batter with a quick back-of-the-hand slower ball cutter.',
        isGenerating: false,
      });
      setHighlightedFields(['deep_backward_square', 'fine_leg', 'deep_mid_wicket']);
    } else {
      setStrategy({
        weakness: 'Opponent exhibits timing instability when switching between wide angles and sudden pace-off variations in death overs.',
        bowling: 'Mix up high-speed wide yorkers (142 km/h) with slow off-cutter yorkers (122 km/h) directed at the tramline.',
        fielding: 'Protect boundary perimeter edges. Highlighted: Deep Point, Deep Cover, Deep Third Man, and Deep Mid-Wicket.',
        tacticalAdvice: 'Vary pace on every ball to deny the batsman any rhythm. Avoid throwing full straight lines down the middle.',
        counterPlan: 'Batter will move deep inside the crease to turn wide balls into full tosses. Bowler must alter the crease release point to keep ball wide.',
        isGenerating: false,
      });
      setHighlightedFields(['deep_point', 'deep_cover', 'deep_third_man', 'deep_mid_wicket']);
    }
  };

  return (
    <div className="relative min-h-screen bg-sportsDark text-white overflow-hidden font-sans">
      {/* Background Decorative Neon Glow elements */}
      <div className="absolute top-[20%] left-[-10%] w-[35rem] h-[35rem] bg-sportsGreen/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[35rem] h-[35rem] bg-sportsBlue/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Global Cybernetic Grid Backdrop */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

      <div className="relative flex flex-col min-h-screen z-10">
        {/* Header */}
        <Header />

        {/* Dashboard Content Container */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Match situation & tactical field layout (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6 w-full">
              <MatchDashboard 
                matchData={matchData} 
                onUpdateMatchData={handleUpdateMatchData}
                winProbability={winProbability}
              />

              <div className="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden">
                <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300">
                    Tactical 3D Field Overview
                  </h3>
                  <span className="text-[9px] text-sportsBlue font-mono uppercase bg-sportsBlue/10 px-2 py-0.5 rounded border border-sportsBlue/20 font-bold">
                    Interactive Grid
                  </span>
                </div>
                <FieldDiagram highlightedPositions={highlightedFields} />
                <p className="text-[10px] text-slate-400 text-center mt-3 font-mono">
                  Hover over dots to examine fielder zones. Neon borders show active coverage targets.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: AI predictions & Opponent Learning (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6 w-full">
              <PredictionPanel 
                prediction={prediction} 
                onPredict={handlePredict}
                apiKey={apiKey}
                onSaveApiKey={handleSaveApiKey}
                apiError={apiError}
              />

              <OpponentLearning 
                strategy={strategy} 
                onGenerate={handleGenerateStrategy} 
              />
            </div>

          </div>

          {/* Footer Cyber Telemetry Strip */}
          <footer className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-sportsGreen" />
              <span>DATA INTEGRITY SECURED • SYNC: STABLE</span>
            </div>
            
            <div className="flex items-center gap-5 text-[10px] text-slate-400 font-mono">
              <div className="flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-sportsBlue" />
                <span>ENGAGEMENT: CSK VS MI</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-sportsYellow" />
                <span>IPL TACTICAL SIMULATOR</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
