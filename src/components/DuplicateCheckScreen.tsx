import React from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { HouseHold } from '../types';

interface DuplicateCheckScreenProps {
  newHousehold: HouseHold;
  existingHousehold: HouseHold;
  onResolve: (action: 'select' | 'keep-both', selectedHH?: HouseHold) => void;
  language: 'English' | 'Hindi';
}

const DuplicateCheckScreen: React.FC<DuplicateCheckScreenProps> = ({
  newHousehold,
  existingHousehold,
  onResolve,
  language
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const HouseholdCard = ({ household, title, isNew }: { household: HouseHold, title: string, isNew?: boolean }) => (
    <div className={`p-4 rounded-lg border-2 ${isNew ? 'border-orange-300 bg-orange-50' : 'border-blue-300 bg-blue-50'}`}>
      <h3 className={`font-semibold mb-3 ${isNew ? 'text-orange-900' : 'text-blue-900'}`}>{title}</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">क्रम संख्या:</span>
          <span className="font-medium">{household.serialNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">बकरीपालक दीदी का नाम:</span>
          <span className="font-medium">{household.hhDidiName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">पिता या पति का नाम:</span>
          <span className="font-medium">{household.relativeName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">फोन:</span>
          <span className="font-medium">{household.phoneNumber || 'उपलब्ध नहीं'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">गांव:</span>
          <span className="font-medium">{household.village}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">समुदाय:</span>
          <span className="font-medium">{household.community}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">बकरे:</span>
          <span className="font-medium">
            <span className="text-pink-600">🐄 {household.femaleGoats.length}</span>, <span className="text-blue-600">🐐 {household.maleGoats.length}</span>
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">कुल झुंड:</span>
          <span className="font-medium text-green-600">
            {household.femaleGoats.length + household.maleGoats.length}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">रुचि:</span>
          <span className="font-medium">{household.willingness === 'Yes' ? 'हां' : household.willingness === 'No' ? 'नहीं' : 'शायद'}</span>
        </div>
        {!isNew && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">बनाया गया:</span>
            <span className="font-medium text-xs">{formatDate(household.createdAt)}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-red-50 border-b border-red-200 p-4">
        <div className="flex items-center text-red-800">
          <AlertTriangle className="h-6 w-6 mr-2" />
          <div>
            <h1 className="text-lg font-semibold">समान एंट्री मिली</h1>
            <p className="text-sm text-red-600">
              समान नाम और गांव के साथ समान घर मिला
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <HouseholdCard 
          household={newHousehold} 
          title="नई एंट्री (वर्तमान)" 
          isNew={true}
        />
        
        <div className="flex items-center justify-center">
          <div className="bg-gray-200 rounded-full p-2">
            <div className="text-gray-600 text-sm font-medium">बनाम</div>
          </div>
        </div>

        <HouseholdCard 
          household={existingHousehold} 
          title="मौजूदा एंट्री" 
        />

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">आप क्या करना चाहेंगे?</h3>
          <p className="text-sm text-yellow-700">
            चुनें कि मौजूदा एंट्री को बदलना है या समीक्षा के लिए दोनों एंट्री रखनी है।
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-gray-50 border-t p-4 space-y-3">
        <button
          onClick={() => onResolve('select', newHousehold)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          नई एंट्री चुनें (मौजूदा को बदलें)
        </button>
        
        <button
          onClick={() => onResolve('keep-both')}
          className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-amber-700 transition-colors"
        >
          दोनों रखें (बाद में समीक्षा करें)
        </button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            ऑफ़लाइन एंट्री सिंक होने पर समीक्षा के लिए सूची में आ जाएंगी
          </p>
        </div>
      </div>
    </div>
  );
};

export default DuplicateCheckScreen;