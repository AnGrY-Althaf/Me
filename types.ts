import React from 'react';

export interface Project {
  id: number;
  title: string;
  category: string;
  stats: string;
}

export interface Service {
  title: string;
  description: string;
  count: string;
  icon: React.ReactNode;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Credential {
    name: string;
    issuer: string;
    date: string;
    icon: React.ReactNode;
}

export interface Achievement {
    title: string;
    description: string;
    rank: string;
}

export interface Job {
  role: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
}