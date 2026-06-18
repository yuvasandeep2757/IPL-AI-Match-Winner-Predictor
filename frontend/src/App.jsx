import { useState } from 'react'

const TEAMS = [
  "Chennai Super Kings", "Deccan Chargers", "Delhi Capitals", "Gujarat Lions",
  "Gujarat Titans", "Kochi Tuskers Kerala", "Kolkata Knight Riders",
  "Lucknow Super Giants", "Mumbai Indians", "Pune Warriors", "Punjab Kings",
  "Rajasthan Royals", "Rising Pune Supergiants", "Royal Challengers Bengaluru",
  "Sunrisers Hyderabad"
];

const VENUES = [
  "Wankhede Stadium, Mumbai",
  "Eden Gardens, Kolkata",
  "M Chinnaswamy Stadium, Bengaluru",
  "MA Chidambaram Stadium, Chennai",
  "Narendra Modi Stadium, Ahmedabad"
];

function App() {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  // REMOVED DEFAULT VENUE
  const [venue, setVenue] = useState("");
  const [tossWinner, setTossWinner] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const runPrediction = async () => {
    if (!team1 || !team2) return alert("Please select both teams!");
    if (team1 === team2) return alert("A team cannot play against itself.");
    if (!venue) return alert("Please select a Stadium/Venue!");
    if (!tossWinner) return alert("Please select who won the toss!");

    setLoading(true);
    setPrediction(null);

    try {
      const response = await fetch('https://yuvasandeep1934.pythonanywhere.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team1, team2, toss_winner: tossWinner, venue })
      });
      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      alert("Could not connect to the backend server. Is Python running?");
    }
    setLoading(false);
  };

  const p1 = prediction ? prediction.team1_prob : 0;
  const p2 = prediction ? prediction.team2_prob : 0;

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col md:flex-row items-start justify-center p-6 gap-8 font-sans text-white pt-20">
      
      {/* LEFT COLUMN: Input Form Only */}
      <div className="bg-[#131B2C] p-8 rounded-3xl shadow-[0_0_50px_-12px_rgba(59,130,246,0.25)] max-w-sm w-full border border-slate-800 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1.5 bg-blue-500 rounded-b-full"></div>

        {/* TITLE CHANGED */}
        <h1 className="text-2xl font-extrabold text-center mb-8 mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight">
          🏏 AI Match Winner Predictor
        </h1>

        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Batting First</label>
            <select value={team1} onChange={(e) => {setTeam1(e.target.value); setTossWinner("");}} className="w-full bg-[#070A11] border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
              <option value="" disabled>Select Team 1</option>
              {TEAMS.map(team => <option key={team} value={team}>{team}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Chasing</label>
            <select value={team2} onChange={(e) => {setTeam2(e.target.value); setTossWinner("");}} className="w-full bg-[#070A11] border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
              <option value="" disabled>Select Team 2</option>
              {TEAMS.map(team => <option key={team} value={team}>{team}</option>)}
            </select>
          </div>

          <hr className="border-slate-800 my-4" />

          {/* VENUE DROPDOWN WITH PLACEHOLDER */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Stadium / Venue</label>
            <select value={venue} onChange={(e) => setVenue(e.target.value)} className="w-full bg-[#070A11] border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
              <option value="" disabled>Select a Stadium / Venue</option>
              {VENUES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Toss Winner</label>
            <select value={tossWinner} onChange={(e) => setTossWinner(e.target.value)} disabled={!team1 || !team2} className="w-full bg-[#070A11] border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50">
              <option value="" disabled>{(!team1 || !team2) ? "Select teams first" : "Who won the toss?"}</option>
              {team1 && <option value={team1}>{team1}</option>}
              {team2 && <option value={team2}>{team2}</option>}
            </select>
          </div>

          <button onClick={runPrediction} disabled={loading} className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-900/30 transition-all active:scale-95">
            {loading ? "Analyzing Matrix..." : "Run Prediction Matrix ⚡"}
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Master Results Dashboard (No scrolling needed!) */}
      {prediction && (
        <div className="bg-[#131B2C] p-8 rounded-3xl shadow-[0_0_50px_-12px_rgba(168,85,247,0.15)] max-w-md w-full border border-slate-800 relative flex flex-col gap-6 animate-fade-in-up">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-purple-500 rounded-b-full"></div>
          
          <h2 className="text-xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 tracking-tight">
            📊 Match Analytics & Results
          </h2>

          {/* 1. WINNER OR TIE BANNER */}
          <div className="bg-[#070A11] p-5 rounded-2xl border border-slate-700/50">
            <h3 className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              {prediction.is_tie ? "Match Result" : "AI Projected Winner"}
            </h3>
            
            {/* SUPER OVER UI IF TIED */}
            {prediction.is_tie ? (
              <div className="text-center">
                <div className="text-xl font-black text-yellow-400 mb-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.2)]">
                  ⚖️ The Match is Tied!
                </div>
                <div className="text-md font-bold text-green-400 bg-green-900/20 py-2 rounded-lg border border-green-800/50">
                  🔥 {prediction.super_over_winner} won in Super Over
                </div>
              </div>
            ) : (
              <div className="text-center text-2xl font-black text-green-400 mb-4 drop-shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                🏆 {prediction.predicted_winner}
              </div>
            )}

            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-xs font-bold">
                <span className={prediction.predicted_winner === team1 || prediction.is_tie ? "text-green-400" : "text-slate-400"}>{team1}: {p1}%</span>
                <span className={prediction.predicted_winner === team2 || prediction.is_tie ? "text-green-400" : "text-slate-400"}>{team2}: {p2}%</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${p1}%` }}></div>
                <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${p2}%` }}></div>
              </div>
            </div>
          </div>

          {/* 2. PROJECTED SCORES WITH OPTIONAL SUPER OVER NUMBERS */}
          <div className="bg-[#070A11] p-5 rounded-2xl border border-slate-700/50">
            <h4 className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-3 flex items-center gap-2">
              <span>🎯</span> Projected Score {prediction.is_tie && <span className="text-yellow-400">(+ Super Over)</span>}
            </h4>
            <div className="text-sm space-y-4">
              <div className="flex flex-col">
                <span className="text-slate-400 text-xs mb-1">{team1}</span>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-lg">{prediction.projected_scores.team1_score}</span>
                  {prediction.is_tie && <span className="text-yellow-400 text-[10px] font-bold bg-yellow-400/10 px-2 py-1 rounded border border-yellow-500/30 text-right w-1/3">SO: {prediction.projected_scores.super_over_t1}</span>}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 text-xs mb-1">{team2}</span>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-lg">{prediction.projected_scores.team2_score}</span>
                  {prediction.is_tie && <span className="text-yellow-400 text-[10px] font-bold bg-yellow-400/10 px-2 py-1 rounded border border-yellow-500/30 text-right w-1/3">SO: {prediction.projected_scores.super_over_t2}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* 3. HEAD TO HEAD */}
          <div className="bg-[#070A11] p-5 rounded-2xl border border-slate-700/50">
            <h4 className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-3 flex items-center gap-2">
              <span>📚</span> Historical H2H
            </h4>
            <div className="text-sm text-slate-300 space-y-2">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span>Total Matches</span>
                <span className="font-bold text-white">{prediction.h2h.total_matches}</span>
              </div>
              <div className="flex justify-between">
                <span className="truncate pr-2">{team1}</span>
                <span className="text-blue-400 font-bold">{prediction.h2h.team1_wins}</span>
              </div>
              <div className="flex justify-between">
                <span className="truncate pr-2">{team2}</span>
                <span className="text-indigo-400 font-bold">{prediction.h2h.team2_wins}</span>
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  )
}

export default App