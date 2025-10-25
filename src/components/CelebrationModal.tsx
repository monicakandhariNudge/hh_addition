import React from 'react';
import { Trophy, Star, Sparkles, TrendingUp, Target } from 'lucide-react';

interface CelebrationModalProps {
  todayCount: number;
  weekCount: number;
  weeklyTarget: number;
  onClose: () => void;
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({
  todayCount,
  weekCount,
  weeklyTarget,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-yellow-50 via-white to-green-50 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-bounce-in relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400"></div>

        <div className="absolute -top-4 -right-4 animate-spin-slow">
          <Sparkles className="h-16 w-16 text-yellow-400 opacity-50" />
        </div>
        <div className="absolute -bottom-4 -left-4 animate-pulse">
          <Star className="h-20 w-20 text-green-400 opacity-30" />
        </div>

        <div className="relative z-10 text-center">
          <div className="mb-6">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-xl animate-bounce">
              <Trophy className="h-14 w-14 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3 animate-pulse">
            🎉 बधाई हो! 🎉
          </h2>

          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 mb-6 border-2 border-green-300 shadow-lg">
            <p className="text-xl font-bold text-green-800 mb-2">
              आज का लक्ष्य पूरा हो गया!
            </p>
            <div className="flex items-center justify-center space-x-3 mb-3">
              <Target className="h-8 w-8 text-green-600" />
              <span className="text-4xl font-bold text-green-700">
                {todayCount}
              </span>
              <span className="text-2xl text-green-600">HH</span>
            </div>
            <p className="text-sm text-green-700">
              आज जोड़े गए
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-4 mb-6 border border-blue-300">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <p className="font-semibold text-blue-800">साप्ताहिक प्रगति</p>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl font-bold text-blue-700">
                {weekCount}
              </span>
              <span className="text-sm text-blue-600">/ {weeklyTarget}</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((weekCount / weeklyTarget) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-center space-x-2 text-yellow-700">
              <Star className="h-5 w-5 fill-yellow-400" />
              <span className="font-medium">शानदार मेहनत!</span>
            </div>
            <p className="text-sm text-gray-600">
              आप बहुत अच्छा काम कर रहे हैं!
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            बहुत बढ़िया! जारी रखें
          </button>
        </div>
      </div>
    </div>
  );
};

export default CelebrationModal;
