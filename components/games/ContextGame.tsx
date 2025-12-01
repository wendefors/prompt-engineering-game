import React, { useState, useEffect } from 'react';
import { Ghost, Bot, User, XCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContextGameProps {
  isHardMode: boolean;
  onComplete: (success: boolean) => void;
}

type CharacterType = 'robot' | 'human' | 'alien';

interface Visitor {
    id: number;
    type: CharacterType;
}

export const ContextGame: React.FC<ContextGameProps> = ({ isHardMode, onComplete }) => {
  const [queue, setQueue] = useState<Visitor[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string>("");
  const [processedCount, setProcessedCount] = useState(0);

  // Game Config
  const MAX_VISITORS = 10;

  useEffect(() => {
      const types: CharacterType[] = ['robot', 'robot', 'human', 'alien', 'human'];
      const newQueue = Array.from({ length: MAX_VISITORS }).map((_, i) => ({
          id: i,
          type: types[Math.floor(Math.random() * types.length)]
      }));
      setQueue(newQueue);
  }, []);

  useEffect(() => {
      if (processedCount >= 5) { 
           // In hard mode, luck helps. In easy mode, score helps.
           onComplete(score >= 30); 
      }
  }, [processedCount, score, onComplete]);

  const currentVisitor = queue[0];

  const handleDecision = (allow: boolean) => {
      if (!currentVisitor) return;

      let points = 0;
      let msg = "";

      // Context: Robot Club
      const isCorrectAccordingToRule = 
        (currentVisitor.type === 'robot' && allow) || 
        (currentVisitor.type !== 'robot' && !allow);

      if (isCorrectAccordingToRule) {
          points = 10;
          if (isHardMode) {
              msg = "RÄTT";
          } else {
              msg = "RÄTT!";
          }
      } else {
          points = -10;
          if (isHardMode) {
              msg = "FEL";
          } else {
              msg = "FEL! Endast robotar idag!";
          }
      }

      setScore(s => s + points);
      setFeedback(msg);
      setQueue(prev => prev.slice(1));
      setProcessedCount(c => c + 1);

      setTimeout(() => setFeedback(""), 1000);
  };

  const getIcon = (type: CharacterType) => {
      switch(type) {
          case 'robot': return <Bot size={40} className="text-blue-400" />;
          case 'human': return <User size={40} className="text-yellow-400" />;
          case 'alien': return <Ghost size={40} className="text-green-400" />;
      }
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-900 relative overflow-hidden">
       {/* Instruction Header */}
       <div className="w-full bg-black border-b-4 border-gray-700 p-3 text-center z-10 shrink-0 shadow-lg">
            {isHardMode ? (
                <>
                    <h2 className="text-xlent-accent font-arcade text-xs leading-relaxed mb-1">
                        PROMPT: "DU ÄR DÖRRVAKT PÅ EN KLUBB, AVGÖR VILKA GÄSTER SOM SKA SLÄPPAS IN."
                    </h2>
                    <p className="text-red-400 text-[10px] font-mono animate-pulse">
                        SAKNAD KONTEXT: Vem får komma in och vem ska avvisas?
                    </p>
                </>
            ) : (
                <>
                    <h2 className="text-xlent-accent font-arcade text-xs leading-relaxed mb-1">
                       PROMPT: "DU ÄR DÖRRVAKT PÅ EN KLUBB, AVGÖR VILKA GÄSTER SOM SKA SLÄPPAS IN."
                    </h2>
                    <p className="text-green-400 text-[10px] font-mono">
                        KONTEXT: Ikväll är det exklusiv robotkväll på klubben.
                    </p>
                </>
            )}
       </div>

       {/* Score Board */}
       <div className="absolute top-3 right-3 text-white font-arcade text-[10px] z-20 bg-black/50 px-2 py-1 rounded">
           SCORE: {score}
       </div>

       {/* Main Game Area - Using Flexbox to distribute space properly */}
       <div className="flex-1 flex flex-col items-center justify-end relative min-h-0 w-full overflow-hidden pb-4">
            
            {/* Feedback Overlay - positioned in empty space above door */}
            <div className="h-8 flex justify-center w-full z-30 pointer-events-none mb-2">
                {feedback && (
                    <span className={`
                        font-arcade px-2 py-1 text-[10px] rounded border shadow-xl backdrop-blur-md flex items-center
                        ${feedback.includes("Fel") || feedback === "FEL" ? 'bg-red-900/90 border-red-500 text-red-100' : 'bg-green-900/90 border-green-500 text-green-100'}
                    `}>
                        {feedback}
                    </span>
                )}
            </div>

            {/* Door Frame Graphic */}
            <div className="relative w-36 h-48 border-x-8 border-t-8 border-gray-700 rounded-t-full bg-black/60 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] flex items-end justify-center shrink-0">
                {/* Floor glow */}
                <div className="absolute bottom-0 w-full h-4 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
                
                 {/* Character (Absolute centered within door context) */}
                 <div className="absolute bottom-4 z-10"> 
                    <AnimatePresence mode='popLayout'>
                        {currentVisitor && (
                            <motion.div
                                key={currentVisitor.id}
                                initial={{ x: 150, opacity: 0, scale: 0.8 }}
                                animate={{ x: 0, opacity: 1, scale: 1 }}
                                exit={{ x: -150, opacity: 0, scale: 0.8 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <div className="bg-gray-800 p-2 rounded-xl border-2 border-gray-500 shadow-2xl w-24 h-32 flex flex-col items-center justify-center gap-2">
                                    {getIcon(currentVisitor.type)}
                                    <div className="font-arcade text-gray-400 text-[8px] uppercase tracking-widest mt-1 border-t border-gray-600 pt-1 w-full text-center">
                                        {currentVisitor.type}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
       </div>

       {/* Controls Footer - Dedicated space */}
       <div className="w-full bg-gray-800 p-3 border-t-4 border-gray-900 shrink-0 z-20">
           <div className="flex justify-center gap-4 max-w-sm mx-auto">
                <button 
                        onClick={() => handleDecision(false)}
                        className="flex-1 bg-red-700 hover:bg-red-600 text-white font-arcade py-3 rounded-lg border-b-4 border-red-900 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center justify-center gap-1 h-16"
                    >
                        <XCircle size={20} />
                        <span className="text-[10px]">AVVISA</span>
                </button>
                <button 
                        onClick={() => handleDecision(true)}
                        className="flex-1 bg-green-700 hover:bg-green-600 text-white font-arcade py-3 rounded-lg border-b-4 border-green-900 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center justify-center gap-1 h-16"
                    >
                        <CheckCircle size={20} />
                        <span className="text-[10px]">SLÄPP IN</span>
                </button>
           </div>
       </div>
    </div>
  );
};