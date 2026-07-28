import React, { useEffect, useRef, useState } from 'react';
import { X, Terminal } from 'lucide-react';
import { ChatMessage } from '../types';

interface TerminalChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const BOOT: ChatMessage = {
  role: 'model',
  text: 'root@angry:~# initializing session...\nAccess granted.\nWelcome to the AnGrY secure channel. Type `help` for available commands.',
};

const TerminalChat: React.FC<TerminalChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([BOOT]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const respond = (message: string): string | null => {
    const q = message.toLowerCase();

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
        '  clear             # Clear terminal',
      ].join('\n');
    }

    // null tells the caller to wipe the log instead of appending.
    if (q.trim() === 'clear' || q.includes('clear')) return null;

    if (q.includes('whoami') || q.includes('who is') || q.includes('identity')) {
      return [
        '[IDENTITY]',
        'Name: Althaf Shajahan (aka AnGrY)',
        'Role: Security Researcher / Bug Bounty Hunter / Red Teamer',
        'Experience: 6+ Years',
        'LinkedIn: https://www.linkedin.com/in/althaf-shajahan-angry/',
        '',
        'Specialized in Offensive Security, Bug Bounty Hunting, CTF, Red team operations,',
        'and Artificial Intelligence.',
      ].join('\n');
    }

    if (q.includes('creds') || q.includes('cert')) {
      return [
        '[CREDENTIALS & CERTS]',
        '• CRTA (Certified Red Team Analyst)',
        '• CEH (Certified Ethical Hacker)',
        '• CAP (Certified AppSec Practitioner)',
        '• CNSP (Certified Network Security Practitioner)',
        '• HTB ProLabs - Dante RastaLabs Poo',
      ].join('\n');
    }

    if (q.includes('experience') || q.includes('work') || q.includes('resume') || q.includes('history')) {
      return [
        '[WORK HISTORY / EXPERIENCE]',
        '',
        '1. Senior Security Researcher @ Offenso Hacker Academy [2025 - Present]',
        '2. Security Researcher @ RedTeam Hacker Acadmey [2023 - 2024]',
        '3. Bug Bounty Hunter @ HackerOne, YesWeHack, BugCrowd [2021 - Present]',
      ].join('\n');
    }

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
        '• Python - Java - Javascript - Golang - C - C++',
      ].join('\n');
    }

    if (q.includes('achievement') || q.includes('hall of fame') || q.includes('award')) {
      return [
        '[ACHIEVEMENTS / HALL OF FAME]',
        '• NASA',
        '• Dela',
        '• MasterCard',
        '• Sony',
        '• HackTheBox - Pro Hacker',
        '• TryHackMe - Top 1%',
      ].join('\n');
    }

    if (q.includes('service') || q.includes('offer')) {
      return [
        '[SERVICES OFFERED]',
        '• Penetration Testing',
        '• AI Integrations (MCP)',
        '• Security Consultation',
        '• Security Automation',
        '• Cyber Security Training / Projects',
        '• Red Teaming (Adversarial Simulation)',
      ].join('\n');
    }

    if (q.includes('contact') || q.includes('linkedin') || q.includes('reach')) {
      return [
        '[CONTACT]',
        'LinkedIn: https://www.linkedin.com/in/althaf-shajahan-angry/',
        'Mail: angry.althaf@gmail.com',
        'SW5zdGFncmFtOiBodHRwczovL3d3dy5pbnN0YWdyYW0uY29tL2lnLmFuZ19yeS8=',
        'For professional inquiries, reach out via LinkedIn/Mail.',
      ].join('\n');
    }

    return 'Command not found. Type `help` for available commands.';
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');

    const reply = respond(text);
    if (reply === null) {
      setMessages([{ role: 'model', text: 'session reset.' }]);
      return;
    }
    setMessages((prev) => [...prev, { role: 'user', text }, { role: 'model', text: reply }]);
  };

  if (!isOpen) return null;

  return (
    <div className="term-scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="term" role="dialog" aria-label="Terminal">
        <div className="term-bar">
          <div className="who">
            <Terminal size={15} />
            <span>root@angry-server:~</span>
          </div>
          <button onClick={onClose} aria-label="Close terminal">
            <X size={17} />
          </button>
        </div>

        <div className="term-log" data-own-scroll>
          {messages.map((m, i) => (
            <div key={i} className={`term-line ${m.role === 'user' ? 'user' : 'system'}`}>
              <span className="tag">{m.role === 'user' ? '> USER' : '> SYSTEM'}</span>
              {m.text}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="term-input">
          <span>root@angry:~$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === 'Enter') send();
            }}
            placeholder="type a command"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
};

export default TerminalChat;
