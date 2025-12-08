import React from 'react';
import { Stat } from '../types';

interface StatsProps {
  stats: Stat[];
}

const Stats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <div className="flex space-x-12 mt-12 md:mt-0">
      {stats.map((stat, index) => (
        <div key={index} className="flex flex-col">
          <span className="text-4xl md:text-5xl font-light text-white">{stat.value}</span>
          <span className="text-[10px] md:text-xs font-semibold tracking-widest text-gray-500 uppercase mt-2">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Stats;