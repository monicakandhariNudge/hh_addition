import React, { useState } from 'react';
import { Search, CreditCard as Edit, Clock, CheckCircle, AlertCircle, XCircle, Calendar, Filter, Check } from 'lucide-react';
import { HouseHold } from '../types';

interface ViewHHsScreenProps {
  households: HouseHold[];
  pendingHouseholds: HouseHold[];
  onUpdateHousehold: (household: HouseHold) => void;
  language: 'English' | 'Hindi';
}

const ViewHHsScreen: React.FC<ViewHHsScreenProps> = ({
  households,
  pendingHouseholds,
  onUpdateHousehold,
  language
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVillage, setSelectedVillage] = useState<string>('');
  const [editingHH, setEditingHH] = useState<HouseHold | null>(null);
  const [editForm, setEditForm] = useState({
    hhDidiName: '',
    relativeName: '',
    phoneNumber: '',
    village: '',
    community: '' as '' | 'General' | 'SC' | 'ST' | 'OBC' | 'Minority/Muslim',
    femaleGoatCount: 0,
    maleGoatCount: 0,
    femaleGoats: [] as Array<{ months: number; years: number }>,
    maleGoats: [] as Array<{ months: number; years: number }>
  });

  const getSyncStatusIcon = (status: HouseHold['syncStatus']) => {
    switch (status) {
      case 'synced':
        return (
          <div className="relative">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
        );
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const groupHouseholdsByDate = (households: HouseHold[]) => {
    const grouped = households.reduce((acc, hh) => {
      const dateKey = hh.createdAt.toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(hh);
      return acc;
    }, {} as Record<string, HouseHold[]>);

    // Sort dates in descending order (newest first)
    return Object.entries(grouped).sort(([a], [b]) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  const filteredHouseholds = households.filter(hh => {
    const matchesSearch = hh.hhDidiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hh.relativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hh.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hh.phoneNumber.includes(searchTerm);
    
    const matchesVillage = !selectedVillage || hh.village === selectedVillage;
    
    return matchesSearch && matchesVillage;
  });

  const totalGoats = households.reduce((sum, hh) => 
    sum + hh.femaleGoats.length + hh.maleGoats.length, 0
  );

  const villages = ['Andayan', 'Kuriyan Purwa', 'Dammu Purwa', 'Ikghara'];

  const startEdit = (hh: HouseHold) => {
    setEditingHH(hh);
    setEditForm({
      hhDidiName: hh.hhDidiName,
      relativeName: hh.relativeName,
      phoneNumber: hh.phoneNumber,
      village: hh.village,
      community: hh.community,
      femaleGoatCount: hh.femaleGoats.length,
      maleGoatCount: hh.maleGoats.length,
      femaleGoats: [...hh.femaleGoats],
      maleGoats: [...hh.maleGoats]
    });
  };

  const saveEdit = () => {
    if (editingHH) {
      const updatedHH: HouseHold = {
        ...editingHH,
        hhDidiName: editForm.hhDidiName,
        relativeName: editForm.relativeName,
        phoneNumber: editForm.phoneNumber,
        village: editForm.village,
        community: editForm.community,
        femaleGoats: editForm.femaleGoats,
        maleGoats: editForm.maleGoats,
        syncStatus: 'pending' // Mark as pending after edit
      };
      onUpdateHousehold(updatedHH);
      setEditingHH(null);
    }
  };

  const cancelEdit = () => {
    setEditingHH(null);
    setEditForm({ 
      hhDidiName: '', 
      relativeName: '', 
      phoneNumber: '', 
      village: '', 
      community: '',
      femaleGoatCount: 0,
      maleGoatCount: 0,
      femaleGoats: [],
      maleGoats: []
    });
  };

  if (editingHH) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="bg-white border-b p-4">
          <h2 className="text-lg font-semibold">घर संपादित करें</h2>
          <p className="text-sm text-gray-600">क्रम संख्या: {editingHH.serialNumber}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              बकरीपालक दीदी का नाम *
            </label>
            <input
              type="text"
              value={editForm.hhDidiName}
              onChange={(e) => setEditForm(prev => ({ ...prev, hhDidiName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              पिता या पति का नाम *
            </label>
            <input
              type="text"
              value={editForm.relativeName}
              onChange={(e) => setEditForm(prev => ({ ...prev, relativeName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              फोन नंबर
            </label>
            <input
              type="tel"
              value={editForm.phoneNumber}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, '');
                if (numericValue.length <= 10) {
                  setEditForm(prev => ({ ...prev, phoneNumber: numericValue }));
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="उपलब्ध नहीं"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              समुदाय *
            </label>
            <select
              value={editForm.community}
              onChange={(e) => setEditForm(prev => ({ ...prev, community: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="General">सामान्य (General)</option>
              <option value="SC">अनुसूचित जाति (SC)</option>
              <option value="ST">अनुसूचित जनजाति (ST)</option>
              <option value="OBC">अन्य पिछड़ा वर्ग (OBC)</option>
              <option value="Minority/Muslim">अल्पसंख्यक/मुस्लिम</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              गांव *
            </label>
            <select
              value={editForm.village}
              onChange={(e) => setEditForm(prev => ({ ...prev, village: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">गांव चुनें</option>
              <option value="Village A">गांव अ</option>
              <option value="Village B">गांव आ</option>
              <option value="Village C">गांव इ</option>
              <option value="Village D">गांव ई</option>
              <option value="Village E">गांव उ</option>
            </select>
          </div>
        </div>

        <div className="bg-white border-t p-4 flex gap-3">
          <button
            onClick={cancelEdit}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            रद्द करें
          </button>
          <button
            onClick={saveEdit}
            disabled={!editForm.hhDidiName || !editForm.relativeName || !editForm.village}
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            बदलाव सहेजें
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <h2 className="text-lg font-semibold mb-4">घरेलू रिकॉर्ड</h2>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="नाम, गांव या फोन से खोजें..."
          />
        </div>

        {/* Summary and Village Filter */}
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h3 className="font-semibold text-blue-900">
              सभी (घर-{households.length}, बकरे-{totalGoats})
            </h3>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <Filter className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium text-gray-700">गांव के अनुसार फिल्टर करें</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedVillage('')}
                className={`p-2 text-xs rounded-lg border transition-colors ${
                  selectedVillage === '' 
                    ? 'bg-blue-100 border-blue-300 text-blue-700' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                सभी गांव
              </button>
              {villages.map(village => (
                <button
                  key={village}
                  onClick={() => setSelectedVillage(village)}
                  className={`p-2 text-xs rounded-lg border transition-colors ${
                    selectedVillage === village 
                      ? 'bg-blue-100 border-blue-300 text-blue-700' 
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {village === 'Village A' ? 'गांव अ' : 
                   village === 'Village B' ? 'गांव आ' : 
                   village === 'Village C' ? 'गांव इ' :
                   village === 'Village D' ? 'गांव ई' : 'गांव उ'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {filteredHouseholds.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || selectedVillage ? 'कोई घर नहीं मिला' : 'अभी तक कोई घर नहीं'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || selectedVillage ? 'खोज की शर्तों को समायोजित करने का प्रयास करें' : 'अपना पहला घर जोड़कर शुरुआत करें'}
              </p>
            </div>
          ) : (
            groupHouseholdsByDate(filteredHouseholds).map(([dateString, householdsForDate]) => (
              <div key={dateString} className="space-y-4">
                <div className="flex items-center space-x-2 py-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <h3 className="font-semibold text-gray-900">{formatDateHeader(dateString)}</h3>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {householdsForDate.length} घर
                  </span>
                </div>
                
                {householdsForDate.map((hh) => (
                  <div
                    key={hh.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ml-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          #{hh.serialNumber}
                        </span>
                        {getSyncStatusIcon(hh.syncStatus)}
                      </div>
                      <button
                        onClick={() => startEdit(hh)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">घर की दीदी का नाम:</span>
                        <span className="font-medium">{hh.hhDidiName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">पिता या पति का नाम:</span>
                        <span className="font-medium">{hh.relativeName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">गांव:</span>
                        <span className="font-medium">{hh.village}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">फोन:</span>
                        <span className="font-medium">{hh.phoneNumber || 'उपलब्ध नहीं'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewHHsScreen;