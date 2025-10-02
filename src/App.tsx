import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import MainApp from './components/MainApp';
import { User, HouseHold } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [households, setHouseholds] = useState<HouseHold[]>([]);
  const [pendingHouseholds, setPendingHouseholds] = useState<HouseHold[]>([]);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddHousehold = (household: HouseHold) => {
    setHouseholds(prev => [...prev, household]);
  };

  const handleUpdateHousehold = (updatedHousehold: HouseHold) => {
    setHouseholds(prev => 
      prev.map(hh => hh.id === updatedHousehold.id ? updatedHousehold : hh)
    );
  };

  const handleAddPending = (household: HouseHold) => {
    setPendingHouseholds(prev => [...prev, household]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!user ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <MainApp 
          user={user}
          households={households}
          pendingHouseholds={pendingHouseholds}
          onLogout={handleLogout}
          onAddHousehold={handleAddHousehold}
          onUpdateHousehold={handleUpdateHousehold}
          onAddPending={handleAddPending}
        />
      )}
    </div>
  );
}

export default App;