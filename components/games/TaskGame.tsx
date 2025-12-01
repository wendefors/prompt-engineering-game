import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Flag, Skull } from 'lucide-react';

interface TaskGameProps {
  isHardMode: boolean;
  onComplete: (success: boolean) => void;
}

const GRID_SIZE = 8; 

export const TaskGame: React.FC<TaskGameProps> = ({ isHardMode, onComplete }) => {
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 7 }); // Start bottom left
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  // Config
  // Goals
  const goals = [
      { x: 7, y: 0, color: 'text-green-500', name: 'green', isCorrect: true }, // Correct (Top Right)
      { x: 0, y: 0, color: 'text-red-500', name: 'red', isCorrect: false },   // Wrong (Top Left)
      { x: 7, y: 7, color: 'text-yellow-500', name: 'yellow', isCorrect: false } // Wrong (Bottom Right)
  ];
  
  // LOGIC FOR HARDER MAZE:
  // We explicitly define the safe path. All other tiles become traps.
  // Path: Snake pattern requiring full traversal.
  const safePathStr = new Set([
      "0,7", // Start
      "1,7", "2,7", "3,7", "4,7", "5,7", // Move Right along bottom
      "5,6", "5,5", // Move Up
      "4,5", "3,5", "2,5", "1,5", // Move Left
      "1,4", "1,3", // Move Up
      "2,3", "3,3", "4,3", "5,3", "6,3", // Move Right
      "6,2", "6,1", // Move Up
      "5,1", "4,1", "3,1", "2,1", // Move Left
      "2,0", "3,0", "4,0", "5,0", "6,0", "7,0" // Move Right to Goal
  ]);

  const maxMoves = 40; // Increased due to longer path

  useEffect(() => {
      setLog([isHardMode ? "System: Väntar på input..." : "System: Ruttinläsning klar."]);
  }, [isHardMode]);

  const move = (dx: number, dy: number) => {
    if (gameOver) return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    // Bounds check
    if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) {
      setLog(prev => [...prev.slice(-2), "Vägg!"]);
      return;
    }

    setPlayerPos({ x: newX, y: newY });
    setMoves(m => m + 1);

    // Check Traps
    // If coordinate is NOT in safePathStr, it is a trap.
    const coordKey = `${newX},${newY}`;
    // Exclude goal tiles from being traps
    const isGoal = goals.some(g => g.x === newX && g.y === newY);
    const isSafe = safePathStr.has(coordKey);
    
    if (!isSafe && !isGoal) {
        setLog(prev => [...prev.slice(-2), isHardMode ? "FEL! Dolt hinder." : "VARNING! Mina!"]);
        setPlayerPos({ x: 0, y: 7 }); // Reset to start
        return;
    }

    // Check Goals
    const hitGoal = goals.find(g => g.x === newX && g.y === newY);
    if (hitGoal) {
        if (isHardMode) {
             if (hitGoal.isCorrect) {
                 setGameOver(true);
                 setLog(prev => [...prev, "Mål nått!"]);
                 setTimeout(() => onComplete(true), 1500);
             } else {
                 setLog(prev => [...prev, "Fel mål!"]);
                 setPlayerPos({ x: 0, y: 7 }); // Reset
             }
        } else {
            // Easy mode
            if (hitGoal.isCorrect) {
                setGameOver(true);
                setLog(prev => [...prev, "Uppdrag slutfört!"]);
                setTimeout(() => onComplete(true), 1500);
            } else {
                setLog(prev => [...prev, "Fel flagga, sök den gröna."]);
            }
        }
    }

    if (moves + 1 >= maxMoves) {
      setGameOver(true);
      setLog(prev => [...prev, "Slut på energi."]);
      setTimeout(() => onComplete(false), 1500);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-900 p-2 md:p-4">
      {/* Header Info */}
      <div className="bg-black p-3 border border-gray-700 mb-2 font-arcade text-xs text-center shadow-lg shrink-0">
        {isHardMode ? (
          <div className="flex flex-col gap-1">
              <span className="text-xlent-accent animate-pulse">PROMPT: "TA DIG TILL MÅLET."</span>
              <span className="text-[10px] text-gray-500">(Vilket mål är rätt? Var finns minorna?)</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
               <span className="text-green-400">UPPDRAG: GÅ TILL GRÖN FLAGGA. UNDVIK MINOR.</span>
          </div>
        )}
      </div>

      {/* Grid Container */}
      <div className="flex-1 flex justify-center items-center overflow-hidden min-h-0">
        <div 
            className="grid gap-0.5 bg-gray-800 p-1 rounded border-4 border-gray-700 shadow-2xl"
            style={{ 
                gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                width: '100%',
                maxWidth: '400px',
                aspectRatio: '1/1'
            }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isPlayer = playerPos.x === x && playerPos.y === y;
            const goalAtPos = goals.find(g => g.x === x && g.y === y);
            
            // Logic for traps
            const coordKey = `${x},${y}`;
            const isSafe = safePathStr.has(coordKey);
            const isGoalLoc = goals.some(g => g.x === x && g.y === y);
            const isTrap = !isSafe && !isGoalLoc;
            
            // Show traps only in easy mode
            const showTrap = !isHardMode && isTrap; 
            
            return (
              <div key={i} className="bg-gray-700/50 rounded-[2px] flex items-center justify-center relative border border-gray-600/20">
                {goalAtPos && (
                    <Flag className={`${goalAtPos.color} drop-shadow-md`} size={isHardMode ? 20 : 20} fill="currentColor" />
                )}
                
                {showTrap && <Skull className="text-red-500 opacity-80" size={18} />}

                {isPlayer && (
                  <div className="absolute inset-0 z-10 bg-blue-500 rounded-sm border border-white shadow-[0_0_8px_blue] flex items-center justify-center transition-all duration-200">
                     <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls & Log */}
      <div className="mt-2 flex flex-col items-center gap-2 shrink-0">
        <div className="grid grid-cols-3 gap-2">
            <div />
            <Button variant="arcade" size="sm" onClick={() => move(0, -1)} disabled={gameOver} className="w-12 h-12 flex items-center justify-center"><ArrowUp /></Button>
            <div />
            <Button variant="arcade" size="sm" onClick={() => move(-1, 0)} disabled={gameOver} className="w-12 h-12 flex items-center justify-center"><ArrowLeft /></Button>
            <Button variant="arcade" size="sm" onClick={() => move(0, 1)} disabled={gameOver} className="w-12 h-12 flex items-center justify-center"><ArrowDown /></Button>
            <Button variant="arcade" size="sm" onClick={() => move(1, 0)} disabled={gameOver} className="w-12 h-12 flex items-center justify-center"><ArrowRight /></Button>
        </div>
        
        <div className="w-full max-w-[400px] bg-black border border-green-900 p-2 font-mono text-[10px] text-green-500 h-12 overflow-hidden flex flex-col justify-end">
            {log.map((l, idx) => <div key={idx} className="truncate">> {l}</div>)}
        </div>
      </div>
    </div>
  );
};