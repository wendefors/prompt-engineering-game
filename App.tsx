import React, { useState, useEffect } from 'react';
import { GamePhase } from './types';
import { ArcadeCabinet } from './components/ArcadeCabinet';
import { Button } from './components/ui/Button';
import { RoleGame } from './components/games/RoleGame';
import { TaskGame } from './components/games/TaskGame';
import { ContextGame } from './components/games/ContextGame';
import { MarketingPage } from './components/MarketingPage';
import { Zap, AlertTriangle, CheckCircle, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayTitle, setOverlayTitle] = useState("");
  const [overlayMessage, setOverlayMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0); // Used to force remount of components on retry

  const nextPhase = (next: GamePhase) => {
    setShowOverlay(false);
    setPhase(next);
    setRetryCount(0); // Reset retries on new phase
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error("Confetti failed", e);
    }
  };

  const handleLevelComplete = (success: boolean) => {
    if (phase.startsWith('bad')) {
        // Bad levels always lead to the next bad level or the summary
        if (phase === 'bad-role') nextPhase('bad-task');
        if (phase === 'bad-task') nextPhase('bad-context');
        if (phase === 'bad-context') nextPhase('fail-summary');
    } else if (phase.startsWith('good')) {
        if (success) {
            triggerConfetti();
            if (phase === 'good-role') {
                setOverlayTitle("Roll Klarad!");
                setOverlayMessage("Genom att definiera ROLLEN visste du vilka verktyg du behövde.");
                setShowOverlay(true);
                setTimeout(() => nextPhase('good-task'), 3000);
            }
            if (phase === 'good-task') {
                setOverlayTitle("Uppdrag Klarat!");
                setOverlayMessage("Med ett tydligt UPPDRAG visste du vart du skulle.");
                setShowOverlay(true);
                setTimeout(() => nextPhase('good-context'), 3000);
            }
            if (phase === 'good-context') {
                 setOverlayTitle("Kontext Klarad!");
                 setOverlayMessage("Rätt KONTEXT gav rätt tonläge.");
                 setShowOverlay(true);
                 setTimeout(() => nextPhase('victory'), 3000);
            }
        } else {
            // Failure in good mode: Force restart of the level
            alert("Tiden tog slut eller du gjorde fel! Försök igen. Läs instruktionen noga.");
            setRetryCount(c => c + 1); // This updates the key, forcing the component to remount
        }
    }
  };

  const renderContent = () => {
    if (showOverlay) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-black bg-opacity-90 text-center p-8 animate-pulse z-50 absolute inset-0">
                <h2 className="text-xlent-accent font-arcade text-2xl mb-4">{overlayTitle}</h2>
                <p className="text-white font-sans text-lg">{overlayMessage}</p>
            </div>
        );
    }

    // Unik nyckel (key) som inkluderar retryCount tvingar React att starta om komponenten helt vid misslyckande
    switch (phase) {
      case 'intro':
        return (
          <div className="h-full flex flex-col items-center justify-center bg-gray-900 p-8 text-center bg-[url('https://picsum.photos/seed/tech/800/600')] bg-cover bg-blend-overlay">
            <h1 className="text-4xl font-arcade text-xlent-accent mb-2 drop-shadow-md">PROMPT MASTER</h1>
            <p className="text-gray-300 mb-8 max-w-md font-sans">
              Hur kan du hantera uppgifter med tveksamma instruktioner? Testa dina färdigheter i tre minispel.
            </p>
            <Button variant="arcade" size="lg" onClick={() => nextPhase('bad-intro')}>STARTA SPEL</Button>
          </div>
        );

      case 'bad-intro':
          return (
            <div className="h-full flex flex-col items-center justify-center bg-red-900/20 p-8 text-center">
                <AlertTriangle size={64} className="text-red-500 mb-4 mx-auto" />
                <h2 className="text-2xl font-arcade text-white mb-4">OMGÅNG 1: BRISTFÄLLIGHET</h2>
                <p className="text-gray-300 mb-8">Dina instruktioner kommer vara bristfälliga. Lycka till.</p>
                <Button variant="danger" onClick={() => nextPhase('bad-role')}>GÅ VIDARE</Button>
            </div>
          );

      case 'bad-role':
        return <RoleGame key="bad-role" isHardMode={true} onComplete={handleLevelComplete} />;
      case 'bad-task':
        return <TaskGame key="bad-task" isHardMode={true} onComplete={handleLevelComplete} />;
      case 'bad-context':
        return <ContextGame key="bad-context" isHardMode={true} onComplete={handleLevelComplete} />;

      case 'fail-summary':
        return (
          <div className="h-full flex flex-col items-center justify-center bg-gray-800 p-8 text-center">
            <h2 className="text-2xl font-arcade text-red-500 mb-4">GAME OVER?</h2>
            <p className="text-white mb-6 font-sans">
              Det var svårt, eller hur? <br/><br/>
              Utan <strong>roll</strong>, <strong>uppdrag</strong> och <strong>kontext</strong> blir arbetet mer av en gissningslek.
            </p>
            <Button variant="primary" onClick={() => nextPhase('education')}>LÄR DIG HACKET</Button>
          </div>
        );

      case 'education':
        return (
          <div className="h-full flex flex-col items-center justify-center bg-xlent-dark p-8 text-center">
            <h2 className="text-xl font-bold text-xlent-accent mb-6 font-arcade">PROMPT ENGINEERING 101</h2>
            <div className="space-y-4 text-left w-full max-w-md mb-8">
                <div className="bg-white/10 p-4 rounded border-l-4 border-blue-500">
                    <strong className="text-blue-300 block mb-1">1. ROLL</strong>
                    <span className="text-sm text-gray-200">Vem ska AI:n vara? (Analytiker, kock, kommunikatör)</span>
                </div>
                <div className="bg-white/10 p-4 rounded border-l-4 border-green-500">
                    <strong className="text-green-300 block mb-1">2. UPPDRAG</strong>
                    <span className="text-sm text-gray-200">Vad exakt vill du få utfört? (Analysera texten, felsök koden)</span>
                </div>
                <div className="bg-white/10 p-4 rounded border-l-4 border-yellow-500">
                    <strong className="text-yellow-300 block mb-1">3. KONTEXT</strong>
                    <span className="text-sm text-gray-200">Vilket är sammanhanget?</span>
                </div>
            </div>
            <Button variant="success" onClick={() => nextPhase('good-intro')}>TESTA IGEN (MED RÄTT FÖRUTSÄTTNINGAR)</Button>
          </div>
        );

      case 'good-intro':
          return (
            <div className="h-full flex flex-col items-center justify-center bg-green-900/20 p-8 text-center">
                <Brain size={64} className="text-green-500 mb-4 mx-auto" />
                <h2 className="text-xl md:text-2xl font-arcade text-white mb-4 leading-relaxed">OMGÅNG 2:<br/>ROLL, UPPDRAG OCH KONTEXT</h2>
                <p className="text-gray-300 mb-8 max-w-md">
                   Nu får du se hur mycket enklare det blir när du har rätt förutsättningar och tydliga instruktioner.
                </p>
                <Button variant="success" onClick={() => nextPhase('good-role')}>STARTA OMGÅNG 2</Button>
            </div>
          );

      case 'good-role':
        return <RoleGame key={`good-role-${retryCount}`} isHardMode={false} onComplete={handleLevelComplete} />;
      case 'good-task':
        return <TaskGame key={`good-task-${retryCount}`} isHardMode={false} onComplete={handleLevelComplete} />;
      case 'good-context':
        return <ContextGame key={`good-context-${retryCount}`} isHardMode={false} onComplete={handleLevelComplete} />;

      case 'victory':
         return (
            <div className="h-full flex flex-col items-center justify-center bg-green-900/30 p-8 text-center">
                <CheckCircle size={80} className="text-green-500 mb-6 mx-auto animate-bounce" />
                <h1 className="text-3xl font-arcade text-xlent-accent mb-4">GRATTIS!</h1>
                <p className="text-white mb-8 text-lg">Du har bemästrat grunderna i Prompt Engineering.</p>
                <Button variant="arcade" size="lg" onClick={() => nextPhase('marketing')}>NÄSTA STEG</Button>
            </div>
         );

      case 'marketing':
        return <MarketingPage />;

      default:
        return <div>Error</div>;
    }
  };

  return (
    <ArcadeCabinet title="XLENT PROMPT ACADEMY">
      {renderContent()}
    </ArcadeCabinet>
  );
};

export default App;