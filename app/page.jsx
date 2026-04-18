"use client";

import React, { useState, useMemo } from 'react';
import { 
  Car, Map, Users, Plus, Trash2, Play, Trophy, 
  Search, Check, X, Flag, Award 
} from 'lucide-react';

const FLAG_MAP = {
  // US States & Territories
  "Alabama": "us-al", "Alaska": "us-ak", "Arizona": "us-az", "Arkansas": "us-ar",
  "California": "us-ca", "Colorado": "us-co", "Connecticut": "us-ct", "Delaware": "us-de",
  "Florida": "us-fl", "Georgia": "us-ga", "Hawaii": "us-hi", "Idaho": "us-id",
  "Illinois": "us-il", "Indiana": "us-in", "Iowa": "us-ia", "Kansas": "us-ks",
  "Kentucky": "us-ky", "Louisiana": "us-la", "Maine": "us-me", "Maryland": "us-md",
  "Massachusetts": "us-ma", "Michigan": "us-mi", "Minnesota": "us-mn", "Mississippi": "us-ms",
  "Missouri": "us-mo", "Montana": "us-mt", "Nebraska": "us-ne", "Nevada": "us-nv",
  "New Hampshire": "us-nh", "New Jersey": "us-nj", "New Mexico": "us-nm", "New York": "us-ny",
  "North Carolina": "us-nc", "North Dakota": "us-nd", "Ohio": "us-oh", "Oklahoma": "us-ok",
  "Oregon": "us-or", "Pennsylvania": "us-pa", "Rhode Island": "us-ri", "South Carolina": "us-sc",
  "South Dakota": "us-sd", "Tennessee": "us-tn", "Texas": "us-tx", "Utah": "us-ut",
  "Vermont": "us-vt", "Virginia": "us-va", "Washington": "us-wa", "West Virginia": "us-wv",
  "Wisconsin": "us-wi", "Wyoming": "us-wy", "Washington D.C.": "us-dc",
  
  // Canadian Provinces
  "Alberta": "ca", "British Columbia": "ca", "Manitoba": "ca", "New Brunswick": "ca",
  "Newfoundland": "ca", "Nova Scotia": "ca", "Ontario": "ca", "Prince Edward Island": "ca",
  "Quebec": "ca", "Saskatchewan": "ca", "Northwest Territories": "ca", "Nunavut": "ca", "Yukon": "ca",

  // Mexican States
  "Aguascalientes": "mx", "Baja California": "mx", "Baja California Sur": "mx", "Campeche": "mx", 
  "Chiapas": "mx", "Chihuahua": "mx", "Coahuila": "mx", "Colima": "mx", "Durango": "mx", 
  "Guanajuato": "mx", "Guerrero": "mx", "Hidalgo": "mx", "Jalisco": "mx", "Mexico City": "mx", 
  "State of Mexico": "mx", "Michoacán": "mx", "Morelos": "mx", "Nayarit": "mx", "Nuevo León": "mx", 
  "Oaxaca": "mx", "Puebla": "mx", "Querétaro": "mx", "Quintana Roo": "mx", "San Luis Potosí": "mx", 
  "Sinaloa": "mx", "Sonora": "mx", "Tabasco": "mx", "Tamaulipas": "mx", "Tlaxcala": "mx", 
  "Veracruz": "mx", "Yucatán": "mx", "Zacatecas": "mx"
};

const DEFAULT_PLATES = Object.keys(FLAG_MAP).sort();

const PLAYER_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
];

export default function App() {
  const [appState, setAppState] = useState('SETUP'); 
  const [players, setPlayers] = useState([
    { id: '1', name: 'Player 1', color: PLAYER_COLORS[0] },
    { id: '2', name: 'Player 2', color: PLAYER_COLORS[1] }
  ]);
  const [plates, setPlates] = useState([]);
  const [activePlayerId, setActivePlayerId] = useState(null);

  const handleAddPlayer = () => {
    if (players.length >= 8) return;
    const newId = Date.now().toString();
    setPlayers([...players, { 
      id: newId, 
      name: `Player ${players.length + 1}`, 
      color: PLAYER_COLORS[players.length] 
    }]);
  };

  const handleRemovePlayer = (id) => {
    if (players.length <= 1) return;
    setPlayers(players.filter(p => p.id !== id));
  };

  const handleNameChange = (id, newName) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  const startGame = () => {
    const initialPlates = DEFAULT_PLATES.map(name => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      flagCode: FLAG_MAP[name],
      claimedBy: null,
      custom: false
    }));
    setPlates(initialPlates);
    setActivePlayerId(players[0].id);
    setAppState('PLAYING');
  };

  const handleClaimPlate = (plateId) => {
    setPlates(prevPlates => prevPlates.map(plate => {
      if (plate.id === plateId) {
        if (plate.claimedBy === activePlayerId) {
          return { ...plate, claimedBy: null };
        }
        return { ...plate, claimedBy: activePlayerId };
      }
      return plate;
    }));
  };

  const handleAddCustomPlate = (plateName) => {
    const newPlate = {
      id: plateName.toLowerCase().replace(/\s+/g, '-'),
      name: plateName,
      flagCode: null,
      claimedBy: activePlayerId,
      custom: true
    };
    setPlates(prev => [...prev, newPlate].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const finishGame = () => setAppState('FINISHED');
  const resetGame = () => { setAppState('SETUP'); setPlates([]); };
  const getScore = (playerId) => plates.filter(p => p.claimedBy === playerId).length;

  return (
    <div 
      className="min-h-[100dvh] bg-slate-50 text-slate-900 font-sans selection:bg-blue-200 select-none touch-manipulation"
      style={{ WebkitTapHighlightColor: 'transparent', overscrollBehaviorY: 'contain' }}
    >
      {appState === 'SETUP' && (
        <SetupScreen 
          players={players} 
          onAddPlayer={handleAddPlayer} 
          onRemovePlayer={handleRemovePlayer} 
          onNameChange={handleNameChange}
          onStart={startGame}
        />
      )}
      {appState === 'PLAYING' && (
        <GameScreen 
          players={players} plates={plates}
          activePlayerId={activePlayerId} setActivePlayerId={setActivePlayerId}
          onClaim={handleClaimPlate} onAddCustom={handleAddCustomPlate}
          getScore={getScore} onFinish={finishGame}
        />
      )}
      {appState === 'FINISHED' && (
        <ResultsScreen players={players} plates={plates} getScore={getScore} onRestart={resetGame} />
      )}
    </div>
  );
}

function SetupScreen({ players, onAddPlayer, onRemovePlayer, onNameChange, onStart }) {
  return (
    <div className="max-w-md mx-auto p-6 pt-12 min-h-[100dvh] flex flex-col">
      <div className="text-center mb-10 flex-shrink-0">
        <div className="bg-blue-600 text-white w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
          <Car size={40} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">License Plate Game</h1>
        <p className="text-slate-500 mt-2">Spot plates. Claim territories. Win the drive.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-6 flex-1 overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Users size={20} className="text-slate-400" /> Players
          </h2>
          <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
            {players.length} / 8
          </span>
        </div>

        <div className="space-y-3">
          {players.map((player, index) => (
            <div key={player.id} className="flex items-center gap-3">
              <div className="w-4 h-8 rounded-full shadow-inner flex-shrink-0" style={{ backgroundColor: player.color }} />
              <input
                type="text" value={player.name}
                onChange={(e) => onNameChange(player.id, e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium select-text"
                placeholder={`Player ${index + 1}`} maxLength={15}
              />
              {players.length > 1 && (
                <button onClick={() => onRemovePlayer(player.id)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 active:bg-red-100 rounded-xl transition-colors">
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
        </div>

        {players.length < 8 && (
          <button onClick={onAddPlayer} className="w-full mt-4 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors font-medium">
            <Plus size={20} /> Add Player
          </button>
        )}
      </div>

      <button onClick={onStart} className="w-full bg-blue-600 active:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] mt-auto mb-6">
        Start the Drive <Play size={20} fill="currentColor" />
      </button>
    </div>
  );
}

function GameScreen({ players, plates, activePlayerId, setActivePlayerId, onClaim, onAddCustom, getScore, onFinish }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPlates = useMemo(() => plates.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())), [plates, searchQuery]);
  
  // Group the plates by country based on their flag codes
  const usPlates = filteredPlates.filter(p => p.flagCode && p.flagCode.startsWith('us-'));
  const caPlates = filteredPlates.filter(p => p.flagCode === 'ca');
  const mxPlates = filteredPlates.filter(p => p.flagCode === 'mx');
  const customPlates = filteredPlates.filter(p => p.custom);

  const activePlayer = players.find(p => p.id === activePlayerId);

  // Helper component to render a grouped grid
  const renderPlateGrid = (title, plateArray) => {
    if (plateArray.length === 0) return null;
    return (
      <div className="mb-8">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">{title}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {plateArray.map(plate => {
            const isClaimed = plate.claimedBy !== null;
            const owner = isClaimed ? players.find(p => p.id === plate.claimedBy) : null;
            const isOwnedByActive = plate.claimedBy === activePlayerId;

            return (
              <button
                key={plate.id} onClick={() => onClaim(plate.id)}
                className={`relative p-4 rounded-2xl text-left transition-all duration-200 active:scale-95 flex flex-col justify-between min-h-[110px] ${isClaimed ? 'shadow-sm border border-transparent' : 'bg-white border border-slate-200 shadow-sm active:border-blue-300 active:shadow-md'}`}
                style={{ backgroundColor: isClaimed ? owner?.color : undefined, color: isClaimed ? '#fff' : undefined }}
              >
                <div className="flex justify-between items-start w-full gap-2">
                  <div className="font-bold leading-tight">{plate.name}</div>
                  {plate.flagCode ? (
                    <div className={`flex-shrink-0 w-8 h-6 rounded shadow-sm overflow-hidden flex items-center justify-center ${isClaimed ? 'bg-white/20' : 'bg-slate-100 border border-slate-200'}`}>
                      <img src={`https://flagcdn.com/w40/${plate.flagCode}.png`} srcSet={`https://flagcdn.com/w80/${plate.flagCode}.png 2x`} alt={`${plate.name} flag`} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ) : (
                    <div className={`flex-shrink-0 w-8 h-6 rounded flex items-center justify-center ${isClaimed ? 'text-white/60' : 'text-slate-300 bg-slate-50 border border-slate-200'}`}><Map size={14} /></div>
                  )}
                </div>
                {isClaimed && (
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-semibold opacity-90 truncate pr-2">{owner?.name}</span>
                    {isOwnedByActive ? <span className="bg-white/20 p-1 rounded-full flex-shrink-0"><X size={12} /></span> : <span className="bg-black/10 p-1 rounded-full flex-shrink-0"><Check size={12} /></span>}
                  </div>
                )}
                {!isClaimed && <div className="mt-4 text-xs text-slate-400 font-medium">Tap to claim</div>}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="pb-24 flex flex-col min-h-[100dvh]">
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm pt-2">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car size={24} className="text-blue-600" />
            <span className="font-bold hidden sm:inline">License Plate Game</span>
          </div>
          <button onClick={onFinish} className="text-sm font-bold bg-slate-100 active:bg-slate-200 text-slate-700 px-4 py-2 rounded-full transition-colors flex items-center gap-2">
            <Flag size={16} /> Finish
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-2 pb-2 overflow-x-auto no-scrollbar flex gap-2">
          {players.map(player => {
            const isActive = player.id === activePlayerId;
            const score = getScore(player.id);
            return (
              <button
                key={player.id} onClick={() => setActivePlayerId(player.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl transition-all border ${isActive ? 'border-transparent shadow-md transform scale-105' : 'border-slate-200 bg-white text-slate-600 active:bg-slate-50'}`}
                style={{ backgroundColor: isActive ? player.color : undefined, color: isActive ? '#fff' : undefined }}
              >
                <span className="font-bold whitespace-nowrap">{player.name}</span>
                <span className={`text-xs font-black px-2 py-0.5 rounded-full ${isActive ? 'bg-white/30' : 'bg-slate-100 text-slate-500'}`}>{score}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg select-text"
            placeholder="Search plates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 active:text-slate-600">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="mb-4 flex justify-between items-end">
          <h2 className="text-lg font-extrabold text-slate-800">{searchQuery ? 'Search Results' : 'All Plates'}</h2>
          <span className="text-sm text-slate-500 font-medium">{plates.filter(p => p.claimedBy !== null).length} / {plates.length} Claimed</span>
        </div>

        {filteredPlates.length > 0 ? (
          <div>
            {renderPlateGrid("United States", usPlates)}
            {renderPlateGrid("Canada", caPlates)}
            {renderPlateGrid("Mexico", mxPlates)}
            {renderPlateGrid("Custom Plates", customPlates)}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <Map size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">"{searchQuery}" not found</h3>
            <p className="text-slate-500 mb-6 px-4">Did you spot a rare country or territory plate?</p>
            <button onClick={() => { onAddCustom(searchQuery); setSearchQuery(''); }} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold active:bg-slate-800 transition-colors flex items-center gap-2 mx-auto">
              <Plus size={18} /> Add as Custom Plate
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 left-0 right-0 pointer-events-none flex justify-center z-30">
         <div className="bg-slate-900/95 backdrop-blur text-white px-6 py-3 rounded-full shadow-2xl text-sm font-medium flex items-center gap-3">
           <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activePlayer?.color }} />
           <span>Tapping assigns to <b>{activePlayer?.name}</b></span>
         </div>
      </div>
    </div>
  );
}

function ResultsScreen({ players, plates, getScore, onRestart }) {
  const rankedPlayers = [...players].sort((a, b) => getScore(b.id) - getScore(a.id));
  const winner = rankedPlayers[0];
  const isTie = rankedPlayers.length > 1 && getScore(rankedPlayers[0].id) === getScore(rankedPlayers[1].id);

  return (
    <div className="min-h-[100dvh] flex flex-col max-w-2xl mx-auto p-4 sm:p-6 pb-12">
      <div className="text-center py-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 text-yellow-600 mb-6"><Trophy size={40} /></div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{isTie ? "It's a Tie!" : `${winner.name} Wins!`}</h1>
        <p className="text-slate-500 text-lg">The drive is over. Here are the final results.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8 flex-1">
        {rankedPlayers.map((player, index) => {
          const score = getScore(player.id);
          const playerPlates = plates.filter(p => p.claimedBy === player.id);
          return (
            <div key={player.id} className={`p-6 ${index !== rankedPlayers.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">#{index + 1}</div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      {player.name} {index === 0 && !isTie && <Award size={18} className="text-yellow-500" />}
                    </h2>
                    <p className="text-sm text-slate-500">{score} Plates Claimed</p>
                  </div>
                </div>
                <div className="text-2xl font-black px-4 py-2 rounded-xl text-white shadow-sm" style={{ backgroundColor: player.color }}>{score}</div>
              </div>
              {score > 0 ? (
                <div className="flex flex-wrap gap-2 mt-4">
                  {playerPlates.map(plate => (
                    <span key={plate.id} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-200 flex items-center gap-1.5">
                      {plate.flagCode ? <img src={`https://flagcdn.com/w20/${plate.flagCode}.png`} alt="" className="w-4 h-auto rounded-[2px]" /> : <Flag size={12} className="text-slate-400" />}
                      {plate.name}
                    </span>
                  ))}
                </div>
              ) : <p className="text-sm text-slate-400 italic">No plates found.</p>}
            </div>
          );
        })}
      </div>

      <div className="mt-auto">
        <button onClick={onRestart} className="w-full bg-slate-900 active:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
          <Car size={20} /> Play Again
        </button>
      </div>
    </div>
  );
}
