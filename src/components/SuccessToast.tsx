import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessToastProps {
  serialNumber: string;
  todayCount: number;
  dailyTarget: number;
  onClose: () => void;
}

const SuccessToast: React.FC<SuccessToastProps> = ({
  serialNumber,
  todayCount,
  dailyTarget,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-sm mx-4 border-2 border-green-500">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="bg-green-100 rounded-full p-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              HH #{serialNumber} सफलतापूर्वक जोड़ा गया!
            </p>
            <div className="mt-1 flex items-center space-x-2">
              <div className="bg-blue-100 px-2 py-1 rounded-full">
                <span className="text-xs font-bold text-blue-800">
                  आज: {todayCount}/{dailyTarget}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {dailyTarget - todayCount > 0
                  ? `${dailyTarget - todayCount} और बाकी`
                  : 'लक्ष्य पूरा! 🎉'
                }
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min((todayCount / dailyTarget) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SuccessToast;
