import React from 'react';
import { TrendingUp, Target, Award } from 'lucide-react';
import { ProgressStats, getMotivationalMessage } from '../utils/progressTracker';

interface ProgressCounterProps {
  stats: ProgressStats;
}

const ProgressCounter: React.FC<ProgressCounterProps> = ({ stats }) => {
  const message = getMotivationalMessage(stats);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-lg shadow-lg mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span className="font-semibold text-sm">आज की प्रगति</span>
        </div>
        <div className="flex items-center space-x-1">
          <Award className="h-4 w-4 text-yellow-300" />
          <span className="text-xs opacity-90">लक्ष्य: {stats.dailyTarget}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">आज</span>
            </div>
            <span className="text-lg font-bold">
              {stats.todayCount}/{stats.dailyTarget}
            </span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-emerald-400 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${stats.todayProgress}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs opacity-90">इस सप्ताह</span>
            <span className="text-sm font-semibold">
              {stats.weekCount}/{stats.weeklyTarget}
            </span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-yellow-300 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${stats.weekProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-sm font-medium animate-pulse">{message}</p>
      </div>
    </div>
  );
};

export default ProgressCounter;
