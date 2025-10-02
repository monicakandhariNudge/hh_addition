import React from 'react';
import { Globe, LogOut, User, Phone } from 'lucide-react';
import { User as UserType } from '../types';

interface SettingsScreenProps {
  user: UserType;
  language: 'English' | 'Hindi';
  onLanguageChange: (language: 'English' | 'Hindi') => void;
  onLogout: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  user,
  language,
  onLanguageChange,
  onLogout
}) => {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <h2 className="text-lg font-semibold">सेटिंग्स</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* User Profile */}
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            प्रोफ़ाइल
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">भूमिका</span>
              <span className="font-medium">{user.role}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">फोन नंबर</span>
              <span className="font-medium">{user.phone}</span>
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            भाषा
          </h3>
          <div className="space-y-3">
            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="language"
                value="English"
                checked={language === 'English'}
                onChange={(e) => onLanguageChange(e.target.value as 'English')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-900">English</span>
            </label>
            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="language"
                value="Hindi"
                checked={language === 'Hindi'}
                onChange={(e) => onLanguageChange(e.target.value as 'Hindi')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-900">हिंदी (Hindi)</span>
            </label>
          </div>
        </div>

        {/* App Information */}
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="font-semibold text-gray-900 mb-4">ऐप की जानकारी</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">संस्करण</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">निर्माण</span>
              <span className="font-medium">2024.01</span>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        {(user.role === 'PS' || user.role === 'GM') && (
          <div className="bg-white rounded-lg p-4 border">
            <h3 className="font-semibold text-gray-900 mb-4">खाता</h3>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              भूमिका बदलें / लॉगआउट
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              PS और GM भूमिकाओं के बीच स्विच करने के लिए इसका उपयोग करें
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t p-4">
        <p className="text-center text-sm text-gray-500">
          बकरीपालक सर्वे ऐप
        </p>
      </div>
    </div>
  );
};

export default SettingsScreen;