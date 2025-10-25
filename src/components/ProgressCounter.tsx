import React from 'react';
import { TrendingUp } from 'lucide-react';
import { ProgressStats, getMotivationalMessage } from '../utils/progressTracker';

interface ProgressCounterProps {
  stats: ProgressStats;
}

const ProgressCounter: React.FC<ProgressCounterProps> = ({ stats }) => {
  const message = getMotivationalMessage(stats);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg shadow-md mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold">
                आज: {stats.todayCount}/{stats.dailyTarget}
              </span>
              <span className="text-xs opacity-75">•</span>
              <span className="text-xs opacity-90">
                सप्ताह: {stats.weekCount}/{stats.weeklyTarget}
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-20 bg-white bg-opacity-20 rounded-full h-1 overflow-hidden">
                <div
                  className="bg-green-400 h-1 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${stats.todayProgress}%` }}
                />
              </div>
              <div className="w-16 bg-white bg-opacity-20 rounded-full h-1 overflow-hidden">
                <div
                  className="bg-yellow-300 h-1 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${stats.weekProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressCounter;
