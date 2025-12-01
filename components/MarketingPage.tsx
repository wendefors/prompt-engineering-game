import React from 'react';
import { MARKETING_DATA } from '../constants';
import { Button } from './ui/Button';

export const MarketingPage: React.FC = () => {
  return (
    <div className="h-full bg-xlent-dark overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl mx-auto p-6 md:p-12 text-white">
        
        {/* Header */}
        <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-xlent-accent font-arcade leading-tight">
                {MARKETING_DATA.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 italic">
                {MARKETING_DATA.subtitle}
            </p>
        </div>

        {/* Grid Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Column 1: Utmaningen */}
            <div className="bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4 text-red-300 uppercase tracking-wider">Utmaningen Idag</h3>
                <ul className="space-y-3">
                    {MARKETING_DATA.challenges.map((c, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">•</span>
                            <span className="text-gray-200 text-sm leading-relaxed">{c}</span>
                        </li>
                    ))}
                </ul>
            </div>

             {/* Column 2: Lösningen */}
             <div className="bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4 text-green-300 uppercase tracking-wider">Så Hjälper Vi Er</h3>
                <ul className="space-y-3">
                    {MARKETING_DATA.solution.map((c, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <span className="text-green-400 mt-1">•</span>
                            <span className="text-gray-200 text-sm leading-relaxed">{c}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-xlent-green/20 p-8 rounded-xl border border-xlent-green mb-12">
             <h3 className="text-xl font-bold mb-6 text-xlent-accent uppercase tracking-wider text-center">Ni Får</h3>
             <div className="grid md:grid-cols-3 gap-6">
                {MARKETING_DATA.benefits.map((b, i) => (
                    <div key={i} className="text-center">
                        <div className="w-12 h-12 bg-xlent-green rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold text-white shadow-lg">
                            {i + 1}
                        </div>
                        <p className="text-sm text-gray-100">{b}</p>
                    </div>
                ))}
             </div>
        </div>

        {/* CTA */}
        <div className="text-center p-8 bg-black/40 rounded-xl">
            <h3 className="text-2xl font-bold text-white mb-4">Kontakt</h3>
            <p className="mb-6 text-gray-300">Vill du diskutera detta vidare? Kontakta XLENT i valfri kanal eller klicka på länken nedan.</p>
            <div className="flex justify-center">
                {/* Simulated QR Code */}
                <div className="w-32 h-32 bg-white p-2 rounded-lg">
                    <div className="w-full h-full bg-black flex items-center justify-center text-white text-xs text-center font-mono">
                        [QR KOD]
                        <br/>
                        XLENT
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <Button variant="arcade" onClick={() => window.location.reload()}>SPELA IGEN</Button>
            </div>
        </div>

      </div>
    </div>
  );
};