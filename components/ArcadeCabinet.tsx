import React from 'react';

interface ArcadeCabinetProps {
  children: React.ReactNode;
  title?: string;
}

export const ArcadeCabinet: React.FC<ArcadeCabinetProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-2 font-sans">
      <div className="w-full max-w-4xl bg-gray-800 rounded-3xl p-4 shadow-2xl border-4 border-gray-700 flex flex-col h-[90vh] md:h-[800px]">
        
        {/* Header */}
        <div className="bg-gray-700 rounded-t-xl p-4 mb-4 flex justify-center items-center border-b-4 border-black shrink-0">
          <h1 className="font-arcade text-lg md:text-xl text-yellow-400 tracking-widest uppercase text-center shadow-black drop-shadow-md">
            {title || "PROMPT MASTER"}
          </h1>
        </div>

        {/* Screen Container - PURE FUNCTIONALITY, NO FILTERS */}
        <div className="relative flex-1 bg-black rounded-lg overflow-hidden border-4 border-gray-900 shadow-inner flex flex-col w-full">
            {/* Direct render of children without any z-index overlays blocking it */}
            <div className="w-full h-full relative">
              {children}
            </div>
        </div>

        {/* Footer / Controls Decoration */}
        <div className="mt-6 flex justify-center gap-12 shrink-0">
            <div className="w-16 h-16 rounded-full bg-gray-700 border-b-8 border-gray-900 shadow-lg flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-red-600 shadow-inner active:mt-1 transition-all"></div>
            </div>
             <div className="w-16 h-16 rounded-full bg-gray-700 border-b-8 border-gray-900 shadow-lg flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 shadow-inner active:mt-1 transition-all"></div>
            </div>
        </div>
      </div>
    </div>
  );
};