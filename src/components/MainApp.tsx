import React, { useState } from 'react';
import { Home, List, Settings, LogOut } from 'lucide-react';
import AddHHScreen from './AddHHScreen';
import ViewHHsScreen from './ViewHHsScreen';
import SettingsScreen from './SettingsScreen';
import { User, HouseHold } from '../types';

interface MainAppProps {
  user: User;
  households: HouseHold[];
  pendingHouseholds: HouseHold[];
  onLogout: () => void;
  onAddHousehold: (household: HouseHold) => void;
  onUpdateHousehold: (household: HouseHold) => void;
  onAddPending: (household: HouseHold) => void;
}

const MainApp: React.FC<MainAppProps> = ({
  user,
  households,
  pendingHouseholds,
  onLogout,
  onAddHousehold,
  onUpdateHousehold,
  onAddPending
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');

  const tabs = [
    { id: 0, name: 'घर जोड़ें', icon: Home },
    { id: 1, name: 'घर देखें', icon: List },
    { id: 2, name: 'सेटिंग्स', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <AddHHScreen
            serialNumber={households.length + 1}
            onAddHousehold={onAddHousehold}
            onAddPending={onAddPending}
            existingHouseholds={households}
            language={language}
          />
        );
      case 1:
        return (
          <ViewHHsScreen
            households={households}
            pendingHouseholds={pendingHouseholds}
            onUpdateHousehold={onUpdateHousehold}
            language={language}
          />
        );
      case 2:
        return (
          <SettingsScreen
            user={user}
            language={language}
            onLanguageChange={setLanguage}
            onLogout={onLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-2 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-900">बकरीपालक सर्वे</h1>
            <p className="text-xs text-gray-500">{user.role} • {user.phone}</p>
          </div>
          {(user.role === 'PS' || user.role === 'GM') && (
            <button
              onClick={onLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="भूमिका बदलें"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200">
        <div className="grid grid-cols-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-3 px-2 transition-colors ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MainApp;