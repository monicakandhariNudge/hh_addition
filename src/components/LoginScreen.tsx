import React, { useState } from 'react';
import { Phone, Users } from 'lucide-react';
import { User } from '../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'PS' | 'GM'>('GM');

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setShowRoleSelection(true);
    }
  };

  const handlePhoneChange = (value: string) => {
    // Only allow digits and limit to 10 characters
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 10) {
      setPhone(numericValue);
    }
  };

  const handleRoleSelection = () => {
    onLogin({ phone, role: selectedRole });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">बकरी पालक सर्वेक्षण</h1>
          <p className="text-gray-600 mt-2">जारी रखने के लिए अपना विवरण दर्ज करें</p>
        </div>

        {!showRoleSelection ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                फोन नंबर
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="10 अंकों का फोन नंबर दर्ज करें"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={phone.length < 10}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              आगे बढ़ें
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {phone && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-sm text-gray-600">फोन: </span>
                <span className="font-medium">{phone}</span>
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">अपनी भूमिका चुनें</h2>
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="role"
                    value="GM"
                    checked={selectedRole === 'GM'}
                    onChange={(e) => setSelectedRole(e.target.value as 'GM')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-900 font-medium">GM (बकरी मोबिलाइज़र)</span>
                </label>
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="role"
                    value="PS"
                    checked={selectedRole === 'PS'}
                    onChange={(e) => setSelectedRole(e.target.value as 'PS')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-900 font-medium">PS (पशु सखी)</span>
                </label>
              </div>
            </div>
            {!phone && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  फोन नंबर
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="10 अंकों का फोन नंबर दर्ज करें"
                    required
                  />
                </div>
              </div>
            )}
            <button
              onClick={handleRoleSelection}
              disabled={!phone || phone.length < 10}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {selectedRole} के रूप में जारी रखें
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;