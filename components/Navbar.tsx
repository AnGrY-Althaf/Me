import React from 'react';
import { Github, Mail, Linkedin } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center py-8 px-6 md:px-12 max-w-7xl mx-auto w-full z-50 relative">
      <div className="text-xl font-bold tracking-tighter">
        Althaf Shajahan <span className="text-accent text-xs align-top ml-1">/ AnGrY</span>
      </div>
      
      {/* Navigation links removed for minimalist terminal-only feel */}

      <div className="flex space-x-6 text-gray-400">
        <a href="https://www.linkedin.com/in/althaf-shajahan-angry/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-white transition-colors">
            <Linkedin size={18} />
            <span className="hidden lg:inline text-xs">LinkedIn</span>
        </a>
        <a href="https://github.com/AnGrY-Althaf" className="flex items-center space-x-2 hover:text-white transition-colors">
            <Github size={18} />
            <span className="hidden lg:inline text-xs">Github</span>
        </a>
        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=angry.althaf@gmail.com" className="hover:text-white transition-colors">
            <Mail size={18} />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
