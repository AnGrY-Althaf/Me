import React, { useState } from 'react';
import Navbar from './components/Navbar';
import TerminalChat from './components/TerminalChat';
import { Code, Lock, Terminal, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-background text-white selection:bg-accent selection:text-black overflow-hidden font-sans flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid z-0 pointer-events-none"></div>
      <div className="scanline"></div>
      
      {/* Glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="z-10 relative flex flex-col min-h-screen">
        <Navbar />
        <TerminalChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

        <main className="flex-grow max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col justify-center items-center h-[85vh]">
          
          {/* HERO SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            
            {/* Left Text Content */}
            <div className="lg:col-span-7 z-10 flex flex-col justify-center order-2 lg:order-1">
              
              <div className="animate-fade-in-up delay-100">
                <div className="inline-flex items-center px-3 py-1 mb-6 bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider w-max rounded backdrop-blur-sm">
                  <Activity size={12} className="mr-2 animate-pulse" />
                  Offensive Security Researcher
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] mb-4 tracking-tighter animate-fade-in-up delay-200">
                Althaf <br/> Shajahan
              </h1>
              
              <div className="text-2xl md:text-3xl font-mono text-gray-500 mb-8 animate-fade-in-up delay-300 flex items-center">
                <span className="opacity-50 mr-2">aka</span>
                <span className="text-white font-bold glitch-hover cursor-default bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  AnGrY
                </span>
                <span className="typing-cursor ml-1 text-accent"></span>
              </div>
              
              <p className="text-gray-400 text-sm md:text-base max-w-lg mb-10 leading-relaxed animate-fade-in-up delay-500 border-l-2 border-accent/30 pl-6">
                I break things to make them stronger. Specialized in Offensive Security,
                red team operations, and advanced persistent threat simulation.
                I find the vulnerabilities before the bad guys do.
              </p>

              <div className="animate-fade-in-up delay-700">
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="group relative overflow-hidden flex items-center space-x-3 text-black text-sm font-bold tracking-widest uppercase bg-accent px-8 py-4 hover:bg-white transition-all w-max shadow-[0_0_20px_rgba(74,222,128,0.3)] hover:shadow-[0_0_30px_rgba(74,222,128,0.6)]"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
                  <Terminal size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                  <span>Initialize Terminal</span>
                </button>
                <div className="mt-4 flex items-center space-x-2 text-[10px] text-gray-600 font-mono">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span>System Online // v2.5.0-secure</span>
                </div>
              </div>
            </div>

            {/* Center/Right Image & Floating Elements */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end items-center order-1 lg:order-2 mb-10 lg:mb-0 animate-fade-in-up delay-300">
              
              {/* Complex Cyber-HUD Animation Background */}
              {/* Layer 1: Outer faint perimeter - Slow Rotate */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[650px] md:h-[650px] border border-dashed border-gray-800/40 rounded-full animate-[spin_60s_linear_infinite]"></div>
              
              {/* Layer 2: Middle structural ring - Reverse Rotate Medium */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[550px] md:h-[550px] rounded-full border border-gray-800/30 animate-[spin_30s_linear_infinite_reverse] flex items-center justify-center">
                 {/* Decorative elements on the ring */}
                 <div className="absolute w-[102%] h-1 bg-gray-900/0 border-l border-r border-accent/20"></div>
                 <div className="absolute h-[102%] w-1 bg-gray-900/0 border-t border-b border-accent/20"></div>
              </div>

              {/* Layer 3: Inner active scanner - Fast Rotate */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[480px] md:h-[480px] rounded-full border-t border-l border-accent/30 border-b border-r border-transparent animate-[spin_8s_linear_infinite]"></div>
              
              {/* Layer 4: Pulsing Aura */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] md:w-[400px] md:h-[400px] bg-accent/5 rounded-full blur-3xl animate-pulse-slow"></div>

              {/* Layer 5: Static Crosshairs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-800/50 to-transparent"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-gradient-to-b from-transparent via-gray-800/50 to-transparent"></div>
              
              {/* Main Character Image */}
              <div className="relative z-0 w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden border-2 border-gray-800 bg-[#0a0a0a] group shadow-[0_0_50px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_rgba(74,222,128,0.2)] transition-all duration-500">
                     <img 
                      src={`${import.meta.env.BASE_URL}mypic-anime.png`} 
                      alt="Althaf Shajahan" 
                      className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80"></div>
              </div>

              {/* Floating Icons */}
            </div>
          </div>

        </main>
        
         {/* FOOTER */}
         <footer className="w-full text-center py-6 text-gray-700 text-[10px] uppercase tracking-widest font-mono border-t border-gray-900/50 relative z-10">
              <span className="opacity-50">Authorized Personnel Only // </span> 
              <span className="text-gray-500 hover:text-accent transition-colors cursor-pointer">
                &copy; {new Date().getFullYear()} AnGrY
              </span>
          </footer>
      </div>
    </div>
  );
};

export default App;
