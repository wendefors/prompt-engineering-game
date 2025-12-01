import React, { useState, useEffect } from 'react';
import { Shield, Hammer, Utensils, Pizza, Carrot, Smartphone, Wrench, ChefHat } from 'lucide-react';

interface RoleGameProps {
  isHardMode: boolean;
  onComplete: (success: boolean) => void;
}

interface Item {
  id: number;
  x: number;
  y: number;
  type: 'good' | 'bad';
  icon: React.ReactNode;
}

export const RoleGame: React.FC<RoleGameProps> = ({ isHardMode, onComplete }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15); 
  const [feedback, setFeedback] = useState<string | null>(null);
  
  // Game Loop using Interval (More robust for simple arcade logic than RAF in this context)
  useEffect(() => {
    // 1. Spawner - Slower spawn rate (1000ms)
    const spawnTimer = setInterval(() => {
      const isGoodItem = Math.random() > 0.4;
      let icon;
      let type: 'good' | 'bad';

      if (isGoodItem) {
          const goodIcons = [<Pizza key="p" size={32} />, <Carrot key="c" size={32} />, <Utensils key="u" size={32} />, <ChefHat key="ch" size={32} />];
          icon = goodIcons[Math.floor(Math.random() * goodIcons.length)];
          type = 'good';
      } else {
          const badIcons = [<Hammer key="h" size={32} />, <Wrench key="w" size={32} />, <Smartphone key="s" size={32} />, <Shield key="sh" size={32} />];
          icon = badIcons[Math.floor(Math.random() * badIcons.length)];
          type = 'bad';
      }

      setItems(prev => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          x: Math.random() * 80 + 10, // 10% to 90% width
          y: -15, // Start slightly higher above screen
          type,
          icon
        }
      ]);
    }, 1000);

    // 2. Physics / Mover - Slower speed (0.6)
    const moveTimer = setInterval(() => {
        setItems(prev => {
            return prev
                .map(item => ({ ...item, y: item.y + 0.6 })) // Move down 0.6% per tick
                .filter(item => item.y < 120); // Remove when way off screen
        });
    }, 20); // 50fps approx

    // 3. Game Timer
    const clockTimer = setInterval(() => {
        setTimeLeft(prev => {
            if (prev <= 1) {
                clearInterval(spawnTimer);
                clearInterval(moveTimer);
                clearInterval(clockTimer);
                onComplete(score > 0);
                return 0;
            }
            return prev - 1;
        });
    }, 1000);

    return () => {
        clearInterval(spawnTimer);
        clearInterval(moveTimer);
        clearInterval(clockTimer);
    };
  }, [onComplete, score]); 

  const catchItem = (item: Item) => {
     if (item.type === 'good') {
         setScore(s => s + 10);
         setFeedback(isHardMode ? "RÄTT" : "BRA!");
     } else {
         setScore(s => Math.max(0, s - 10)); 
         setFeedback(isHardMode ? "FEL" : "FEL OBJEKT!");
     }
     
     // Remove item
     setItems(prev => prev.filter(i => i.id !== item.id));
     setTimeout(() => setFeedback(null), 500);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-800 relative overflow-hidden">
      
      {/* HUD - Fixed layout handling for long text using flex-1 and min-w-0 */}
      <div className="bg-slate-900 p-4 border-b-4 border-slate-700 flex justify-between items-start z-20 shrink-0 gap-4">
         <div className="flex flex-col flex-1 min-w-0 justify-center min-h-[3.5rem]">
             {isHardMode ? (
                 <div className="font-arcade text-sm md:text-base text-red-400 animate-pulse leading-tight">
                    <div>PROMPT: SAMLA DET DU</div>
                    <div>BEHÖVER FÖR ATT LÖSA UPPGIFTEN</div>
                 </div>
             ) : (
                 <div className="font-arcade text-sm md:text-base text-yellow-400 leading-tight">
                    <div className="mb-1 text-green-400">ROLL: KOCK</div>
                    <div>PROMPT: SAMLA DET DU</div>
                    <div>BEHÖVER FÖR ATT LÖSA UPPGIFTEN</div>
                 </div>
             )}
             <div className="text-xs text-gray-400 font-mono mt-2">
                 {isHardMode ? "Vilken typ av objekt behöver du?" : "Samla ingredienser och köksredskap."}
             </div>
         </div>
         
         <div className="text-right shrink-0 whitespace-nowrap pt-1">
             <div className="font-arcade text-white text-lg mb-1">TID: {timeLeft}</div>
             <div className="font-arcade text-green-400 text-lg">POÄNG: {score}</div>
         </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative w-full bg-slate-800 overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 opacity-10" style={{ 
              backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
              backgroundSize: '40px 40px'
          }}></div>

          {/* Feedback Text */}
          {feedback && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
                <span className={`font-arcade text-2xl px-6 py-3 rounded-xl border-4 shadow-2xl ${feedback.includes('FEL') ? 'bg-red-600 border-red-800 text-white' : 'bg-green-600 border-green-800 text-white'}`}>
                    {feedback}
                </span>
            </div>
          )}

          {/* Items */}
          {items.map(item => (
              <button
                key={item.id}
                onPointerDown={(e) => { e.preventDefault(); catchItem(item); }}
                onClick={() => catchItem(item)}
                className="absolute transform -translate-x-1/2 p-2 rounded-full z-30 transition-transform active:scale-90 hover:scale-110 focus:outline-none"
                style={{ 
                    left: `${item.x}%`, 
                    top: `${item.y}%`,
                    width: '80px',
                    height: '80px'
                }}
              >
                {/* Always Uniform Color: bg-slate-600 */}
                <div className="w-full h-full rounded-full flex items-center justify-center border-4 shadow-lg bg-slate-600 border-slate-400 text-white">
                    {item.icon}
                </div>
              </button>
          ))}
          
          <div className="absolute bottom-10 w-full text-center pointer-events-none opacity-40">
             <p className="font-arcade text-white text-xs">KLICKA PÅ OBJEKTEN</p>
          </div>
      </div>
    </div>
  );
};