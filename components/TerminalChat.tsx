import React, { useState, useRef, useEffect } from 'react';
import { X, Terminal, Send, ShieldAlert } from 'lucide-react';
import { ChatMessage } from '../types';

interface TerminalChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const TerminalChat: React.FC<TerminalChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'root@angry:~# initializing session...\nAccess granted.\nWelcome to the AnGrY secure channel. How can I help you breach the unknown today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const respondLocally = async (message: string, history: ChatMessage[]): Promise<string> => {
    const q = message.toLowerCase();
    
    // Help command
    if (q.includes('help') || q.includes('--help')) {
      return [
        'Usage: cat ./profile.txt | less',
        'Commands:',
        '  whoami            # Show identity',
        '  creds             # List certifications',
        '  experience        # Show work history',
        '  skills            # Key capabilities',
        '  achievements      # Hall of Fame',
        '  services          # Services offered',
        '  contact           # Contact information',
        '  clear             # Clear terminal'
      ].join('\n');
    }
    
    // Clear command
    if (q.includes('clear')) {
      setMessages([]);
      return 'session reset.';
    }
    
    // Identity/Whoami
    if (q.includes('whoami') || q.includes('who is') || q.includes('identity')) {
      return [
        '[IDENTITY]',
        'Name: Althaf Shajahan (aka AnGrY)',
        'Role: Security Researcher / Bug Bounty Hunter / Red Teamer',
        'Experience: 6+ Years',
        'LinkedIn: https://www.linkedin.com/in/althaf-shajahan-angry/',
        '',
        'Specialized in Offensive Security, Bug Bounty Hunting, CTF, Red team operations,',
        'and Artificial Intelligence.'
      ].join('\n');
    }
    
    // Credentials/Certifications
    if (q.includes('creds') || q.includes('cert') || q.includes('certification')) {
      return [
        '[CREDENTIALS & CERTS]',
        '• CRTA (Certified Red Team Analyst)',
        '• CEH (Certified Ethical Hacker)',
        '• CAP (Certified AppSec Practitioner)',
        '• CNSP (Certified Network Security Practitioner)',
        '• HTB ProLabs - Dante RastaLabs Poo'
      ].join('\n');
    }
    
    // Work History/Experience
    if (q.includes('experience') || q.includes('work') || q.includes('resume') || q.includes('history')) {
      return [
        '[WORK HISTORY / EXPERIENCE]',
        '',
        '1. Senior Security Researcher @ Offenso Hacker Academy [2025 - Present]',
        '2. Security Researcher @ RedTeam Hacker Acadmey [2023 - 2024]',
        '3. Bug Bounty Hunter @ HackerOne, YesWeHack, BugCrowd [2021 - Present]'
      ].join('\n');
    }
    
    // Skills
    if (q.includes('skills') || q.includes('capabilities')) {
      return [
        '[KEY CAPABILITIES]',
        '• Bug Bounty Hunting',
        '• CTF ',
        '• Penetration Testing',
        '• AI / MCP',
        '• Web/ API / Android - Security',
        '• Python / Bash Automation',
        '• Malware Analysis',
        '• Python - Java - Javascript - Golang - C - C++'
      ].join('\n');
    }
    
    // Achievements
    if (q.includes('achievement') || q.includes('hall of fame') || q.includes('award')) {
      return [
        '[ACHIEVEMENTS / HALL OF FAME]',
        '• NASA',
        '• Dela',
        '• MasterCard',
        '• Sony',
        '• HackTheBox - Pro Hacker',
        '• TryHackMe - Top 1%'
      ].join('\n');
    }
    
    // Services
    if (q.includes('service') || q.includes('offer')) {
      return [
        '[SERVICES OFFERED]',
        '• Penetration Testing',
        '• AI Integrations (MCP)',
        '• Security Consultation',
        '• Security Automation',
        '• Cyber Security Training / Projects',
        '• Red Teaming (Adversarial Simulation)'
      ].join('\n');
    }
    
    // Contact
    if (q.includes('contact') || q.includes('linkedin') || q.includes('reach')) {
      return [
        '[CONTACT]',
        'LinkedIn: https://www.linkedin.com/in/althaf-shajahan-angry/',
        'Mail: angry.althaf@gmail.com',
        'SW5zdGFncmFtOiBodHRwczovL3d3dy5pbnN0YWdyYW0uY29tL2lnLmFuZ19yeS8=',
        'For professional inquiries, reach out via LinkedIn.'
      ].join('\n');
    }
    
    // Default response
    return 'Command not found. Type `help` for available commands.';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await respondLocally(input, messages);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#0c0c0c] border border-gray-800 rounded-lg shadow-2xl overflow-hidden font-mono flex flex-col h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-gray-800">
          <div className="flex items-center space-x-2 text-accent">
            <Terminal size={18} />
            <span className="text-sm font-bold tracking-wider">root@angry-server:~</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded p-3 text-sm font-mono whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-gray-800 text-white border border-gray-700' 
                  : 'bg-transparent text-green-400 pl-0'
              }`}>
                <span className="block text-[10px] opacity-50 mb-1">
                  {msg.role === 'user' ? '> USER' : '> SYSTEM'}
                </span>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-transparent text-green-400 p-3 text-sm flex items-center space-x-2">
                 <ShieldAlert className="animate-pulse" size={16} />
                 <span>Executing payload...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-[#1a1a1a] border-t border-gray-800 flex items-center space-x-3">
          <span className="text-accent text-sm">root@angry:~$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="sudo ./ask_question.sh"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600 font-mono text-sm"
            autoFocus
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="text-gray-400 hover:text-accent disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TerminalChat;
