import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Mic, Pencil, Sparkles, Heart, Star, MapPin, Users, MessageSquare } from 'lucide-react';
import DuplicateCheckScreen from './DuplicateCheckScreen';
import { HouseHold } from '../types';

interface AddHHScreenProps {
  serialNumber: number;
  onAddHousehold: (household: HouseHold) => void;
  onAddPending: (household: HouseHold) => void;
  existingHouseholds: HouseHold[];
  language: 'English' | 'Hindi';
}

const AddHHScreen: React.FC<AddHHScreenProps> = ({
  serialNumber,
  onAddHousehold,
  onAddPending,
  existingHouseholds,
  language
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showDuplicateCheck, setShowDuplicateCheck] = useState(false);
  const [showSuccessGraffiti, setShowSuccessGraffiti] = useState(false);
  const [formData, setFormData] = useState({
    village: '',
    hhDidiName: '',
    relativeName: '',
    phoneNumber: '',
    community: '' as '' | 'General' | 'SC' | 'ST' | 'OBC' | 'Minority/Muslim',
    femaleGoats: [] as Array<{ months: number; years: number }>,
    maleGoats: [] as Array<{ months: number; years: number }>,
    willingness: 'Yes' as 'Yes' | 'No' | 'Maybe'
  });
  
  const [femaleGoatCount, setFemaleGoatCount] = useState(0);
  const [maleGoatCount, setMaleGoatCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [currentField, setCurrentField] = useState<string | null>(null);

  const villages = [
    { id: 'andayan', name: 'अंडायन', nameEn: 'Andayan' },
    { id: 'kuriyan-purwa', name: 'कुरियन पुरवा', nameEn: 'Kuriyan Purwa' },
    { id: 'dammu-purwa', name: 'डम्मू पुरवा', nameEn: 'Dammu Purwa' },
    { id: 'ikghara', name: 'इकघरा', nameEn: 'Ikghara' }
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field === 'hhDidiName' || field === 'relativeName') {
      const validPattern = /^[a-zA-Z\u0900-\u097F\s]*$/;
      if (!validPattern.test(value)) {
        return;
      }
    }
    
    if (field === 'phoneNumber') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 10) {
        setFormData(prev => ({ ...prev, [field]: numericValue }));
      }
      return;
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const startVoiceRecognition = (fieldName: string) => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      setIsListening(true);
      setCurrentField(fieldName);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleInputChange(fieldName, transcript);
        setIsListening(false);
        setCurrentField(null);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
        setCurrentField(null);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        setCurrentField(null);
      };
      
      recognition.start();
    } else {
      alert('आपका ब्राउज़र वॉइस रिकॉग्निशन को सपोर्ट नहीं करता');
    }
  };

  const handleFemaleGoatCountChange = (count: number) => {
    setFemaleGoatCount(count);
    const newFemaleGoats = Array(count).fill(null).map(() => ({ months: 0, years: 0 }));
    setFormData(prev => ({ ...prev, femaleGoats: newFemaleGoats }));
  };

  const handleMaleGoatCountChange = (count: number) => {
    setMaleGoatCount(count);
    const newMaleGoats = Array(count).fill(null).map(() => ({ months: 0, years: 0 }));
    setFormData(prev => ({ ...prev, maleGoats: newMaleGoats }));
  };

  const updateFemaleGoatAge = (index: number, field: 'months' | 'years', value: number) => {
    setFormData(prev => ({
      ...prev,
      femaleGoats: prev.femaleGoats.map((goat, i) => 
        i === index ? { ...goat, [field]: value } : goat
      )
    }));
  };

  const updateMaleGoatAge = (index: number, field: 'months' | 'years', value: number) => {
    setFormData(prev => ({
      ...prev,
      maleGoats: prev.maleGoats.map((goat, i) => 
        i === index ? { ...goat, [field]: value } : goat
      )
    }));
  };

  const sendSMS = async () => {
    // Mock SMS sending
    console.log(`SMS sent: घर #${serialNumber} सफलतापूर्वक जोड़ा गया। धन्यवाद!`);
  };

  const handleSubmit = () => {
    const newHousehold: HouseHold = {
      id: Date.now().toString(),
      serialNumber,
      ...formData,
      syncStatus: 'pending',
      createdAt: new Date()
    };

    const duplicate = existingHouseholds.find(hh => 
      hh.hhDidiName.toLowerCase() === formData.hhDidiName.toLowerCase() &&
      hh.village === formData.village
    );

    if (duplicate) {
      setShowDuplicateCheck(true);
    } else {
      onAddHousehold(newHousehold);
      showSuccessAnimation();
    }
  };

  const showSuccessAnimation = () => {
    setShowSuccessGraffiti(true);
    sendSMS();
    setTimeout(() => {
      setShowSuccessGraffiti(false);
      resetForm();
      setCurrentPage(0);
    }, 3000);
  };

  const resetForm = () => {
    setFormData({
      village: '',
      hhDidiName: '',
      relativeName: '',
      phoneNumber: '',
      community: '' as '' | 'General' | 'SC' | 'ST' | 'OBC' | 'Minority/Muslim',
      femaleGoats: [],
      maleGoats: [],
      willingness: 'Yes'
    });
    setFemaleGoatCount(0);
    setMaleGoatCount(0);
  };

  const handleDuplicateResolution = (action: 'select' | 'keep-both', selectedHH?: HouseHold) => {
    const newHousehold: HouseHold = {
      id: Date.now().toString(),
      serialNumber,
      ...formData,
      syncStatus: 'pending',
      createdAt: new Date()
    };

    if (action === 'select') {
      onAddHousehold(newHousehold);
      showSuccessAnimation();
    } else {
      onAddPending(newHousehold);
      showSuccessAnimation();
    }

    setShowDuplicateCheck(false);
  };

  if (showDuplicateCheck) {
    const duplicate = existingHouseholds.find(hh => 
      hh.hhDidiName.toLowerCase() === formData.hhDidiName.toLowerCase() &&
      hh.village === formData.village
    );

    return (
      <DuplicateCheckScreen
        newHousehold={{
          id: 'new',
          serialNumber,
          ...formData,
          syncStatus: 'pending',
          createdAt: new Date()
        }}
        existingHousehold={duplicate!}
        onResolve={handleDuplicateResolution}
        language={language}
      />
    );
  }

  // Page 1: Village Selection
  const renderVillageSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">गांव चुनें</h3>
        <p className="text-gray-600">कृपया बकरीपालक का गांव चुनें</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {villages.map((village) => (
          <button
            key={village.id}
            onClick={() => handleInputChange('village', village.nameEn)}
            className={`p-4 rounded-lg border-2 transition-all ${
              formData.village === village.nameEn
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="text-center">
              <div className="text-lg font-semibold">{village.name}</div>
              <div className="text-sm text-gray-500">{village.nameEn}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Page 2: Basic Information
  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          बकरीपालक दीदी का नाम *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.hhDidiName}
            onChange={(e) => handleInputChange('hhDidiName', e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="नाम दर्ज करें"
            required
          />
          <button 
            type="button"
            onClick={() => startVoiceRecognition('hhDidiName')}
            className={`p-3 rounded-lg transition-colors ${
              isListening && currentField === 'hhDidiName' 
                ? 'bg-red-100 text-red-600 animate-pulse' 
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            <Mic className={`h-5 w-5 ${isListening && currentField === 'hhDidiName' ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          पिता या पति का नाम *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.relativeName}
            onChange={(e) => handleInputChange('relativeName', e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="नाम दर्ज करें"
            required
          />
          <button 
            type="button"
            onClick={() => startVoiceRecognition('relativeName')}
            className={`p-3 rounded-lg transition-colors ${
              isListening && currentField === 'relativeName' 
                ? 'bg-red-100 text-red-600 animate-pulse' 
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            <Mic className={`h-5 w-5 ${isListening && currentField === 'relativeName' ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          फोन नंबर
        </label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="10 अंकों का फोन नंबर दर्ज करें"
          maxLength={10}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          समुदाय *
        </label>
        <select
          value={formData.community}
          onChange={(e) => handleInputChange('community', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">समुदाय चुनें</option>
          <option value="General">सामान्य (General)</option>
          <option value="SC">अनुसूचित जाति (SC)</option>
          <option value="ST">अनुसूचित जनजाति (ST)</option>
          <option value="OBC">अन्य पिछड़ा वर्ग (OBC)</option>
          <option value="Minority/Muslim">अल्पसंख्यक/मुस्लिम</option>
        </select>
      </div>
    </div>
  );

  // Page 3: Female Goats
  const renderGoatCounts = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">बकरीपालक के पास कितनी बकरी और कितने बकरे हैं?</h2>
        <p className="text-sm text-gray-600">कृपया संख्या बताएं</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-5 rounded-2xl border-2 border-pink-200 shadow-sm hover:shadow-md transition-all">
          <div className="text-center mb-4">
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <img src="/src/assets/female.png" alt="Female Goat" className="w-14 h-14" />
            </div>
            <h4 className="font-bold text-pink-900 text-lg mb-1">बकरी</h4>
            <p className="text-xs text-pink-700">Female Goats</p>
          </div>
          <input
            type="number"
            min="0"
            max="50"
            value={femaleGoatCount || ''}
            onChange={(e) => handleFemaleGoatCountChange(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-4 border-2 border-pink-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-center text-2xl font-bold text-pink-900 bg-white"
            placeholder="0"
          />
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl border-2 border-blue-200 shadow-sm hover:shadow-md transition-all">
          <div className="text-center mb-4">
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <img src="/src/assets/male.png" alt="Male Goat" className="w-14 h-14" />
            </div>
            <h4 className="font-bold text-blue-900 text-lg mb-1">बकरा</h4>
            <p className="text-xs text-blue-700">Male Goats</p>
          </div>
          <input
            type="number"
            min="0"
            max="50"
            value={maleGoatCount || ''}
            onChange={(e) => handleMaleGoatCountChange(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-4 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl font-bold text-blue-900 bg-white"
            placeholder="0"
          />
        </div>
      </div>

      {(femaleGoatCount > 0 || maleGoatCount > 0) && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-green-800 font-semibold">
              कुल: {femaleGoatCount + maleGoatCount} बकरे
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Page 4: Female Goats Ages
  const renderFemaleGoats = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="bg-gradient-to-br from-pink-100 to-pink-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
          <img src="/src/assets/female.png" alt="Female Goat" className="w-14 h-14" />
        </div>
        <h3 className="text-xl font-bold text-pink-900 mb-1">बकरी की उम्र</h3>
        <p className="text-sm text-gray-600">कृपया प्रत्येक बकरी की उम्र दर्ज करें</p>
      </div>

      <div className="space-y-3">
        {formData.femaleGoats.map((goat, index) => {
          const isComplete = goat.years > 0 || goat.months > 0;
          return (
            <div key={index} className={`relative p-4 rounded-xl border-2 transition-all ${
              isComplete
                ? 'bg-gradient-to-br from-green-50 to-white border-green-300 shadow-sm'
                : 'bg-gradient-to-br from-red-50 to-white border-red-300'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="bg-pink-100 w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-pink-900 font-bold text-sm">{index + 1}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">बकरी #{index + 1}</h4>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  isComplete ? 'bg-green-500' : 'bg-red-400 animate-pulse'
                }`}></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    साल (Years)
                  </label>
                  <select
                    value={goat.years}
                    onChange={(e) => updateFemaleGoatAge(index, 'years', parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-semibold text-gray-900 bg-white"
                  >
                    {Array.from({ length: 11 }, (_, i) => (
                      <option key={i} value={i}>{i} साल</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    महीने (Months)
                  </label>
                  <select
                    value={goat.months}
                    onChange={(e) => updateFemaleGoatAge(index, 'months', parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-semibold text-gray-900 bg-white"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>{i} महीने</option>
                    ))}
                  </select>
                </div>
              </div>
              {isComplete && (
                <div className="mt-2 text-xs text-green-700 font-medium">
                  ✓ उम्र: {goat.years} साल {goat.months} महीने
                </div>
              )}
            </div>
          );
        })}
      </div>

      {formData.femaleGoats.length > 0 && (
        <div className="mt-4 p-3 bg-pink-100 border border-pink-300 rounded-xl">
          <div className="text-center">
            <p className="text-pink-900 font-semibold text-sm">
              कुल बकरियां: {formData.femaleGoats.length}
            </p>
            <p className="text-xs text-pink-700 mt-1">
              पूर्ण: {formData.femaleGoats.filter(g => g.years > 0 || g.months > 0).length} / {formData.femaleGoats.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Page 5: Male Goats Ages
  const renderMaleGoats = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
          <img src="/src/assets/male.png" alt="Male Goat" className="w-14 h-14" />
        </div>
        <h3 className="text-xl font-bold text-blue-900 mb-1">बकरे की उम्र</h3>
        <p className="text-sm text-gray-600">कृपया प्रत्येक बकरे की उम्र दर्ज करें</p>
      </div>

      <div className="space-y-3">
        {formData.maleGoats.map((goat, index) => {
          const isComplete = goat.years > 0 || goat.months > 0;
          return (
            <div key={index} className={`relative p-4 rounded-xl border-2 transition-all ${
              isComplete
                ? 'bg-gradient-to-br from-green-50 to-white border-green-300 shadow-sm'
                : 'bg-gradient-to-br from-red-50 to-white border-red-300'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-blue-900 font-bold text-sm">{index + 1}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">बकरा #{index + 1}</h4>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  isComplete ? 'bg-green-500' : 'bg-red-400 animate-pulse'
                }`}></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    साल (Years)
                  </label>
                  <select
                    value={goat.years}
                    onChange={(e) => updateMaleGoatAge(index, 'years', parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold text-gray-900 bg-white"
                  >
                    {Array.from({ length: 11 }, (_, i) => (
                      <option key={i} value={i}>{i} साल</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    महीने (Months)
                  </label>
                  <select
                    value={goat.months}
                    onChange={(e) => updateMaleGoatAge(index, 'months', parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold text-gray-900 bg-white"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>{i} महीने</option>
                    ))}
                  </select>
                </div>
              </div>
              {isComplete && (
                <div className="mt-2 text-xs text-green-700 font-medium">
                  ✓ उम्र: {goat.years} साल {goat.months} महीने
                </div>
              )}
            </div>
          );
        })}
      </div>

      {formData.maleGoats.length > 0 && (
        <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-xl">
          <div className="text-center">
            <p className="text-blue-900 font-semibold text-sm">
              कुल बकरे: {formData.maleGoats.length}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              पूर्ण: {formData.maleGoats.filter(g => g.years > 0 || g.months > 0).length} / {formData.maleGoats.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Page 6: Willingness
  const renderWillingness = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-4">क्या परिवार पशु सखी से सशुल्क सेवा लेने में रुचि रखते हैं?</p>
        
        <div className="space-y-3">
          {(['Yes', 'No', 'Maybe'] as const).map((option) => (
            <label
              key={option}
              className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="radio"
                name="willingness"
                value={option}
                checked={formData.willingness === option}
                onChange={() => handleInputChange('willingness', option)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-900 font-medium">
                {option === 'Yes' ? 'हां' : option === 'No' ? 'नहीं' : 'शायद'}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  // Page 7: Review
  const renderReview = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">कृपया पुनः जाँच करें</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <div>
              <p className="font-medium">गांव</p>
              <p className="text-gray-600">{formData.village}</p>
            </div>
            <button onClick={() => setCurrentPage(0)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
              <Pencil className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <div>
              <p className="font-medium">बकरीपालक दीदी का नाम</p>
              <p className="text-gray-600">{formData.hhDidiName}</p>
            </div>
            <button onClick={() => setCurrentPage(1)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
              <Edit3 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <div>
              <p className="font-medium">पिता या पति का नाम</p>
              <p className="text-gray-600">{formData.relativeName}</p>
            </div>
            <button onClick={() => setCurrentPage(1)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <div>
              <p className="font-medium">समुदाय</p>
              <p className="text-gray-600">{formData.community}</p>
            </div>
            <button onClick={() => setCurrentPage(1)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
              <Edit3 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <div>
              <p className="font-medium">कुल झुंड: {formData.femaleGoats.length + formData.maleGoats.length}</p>
              <p className="text-gray-600 flex items-center gap-4">
                <span className="text-pink-600 flex items-center">🐑 बकरी- {formData.femaleGoats.length}</span>
                <span className="text-blue-600 flex items-center">🐐 बकरा- {formData.maleGoats.length}</span>
              </p>
            </div>
            <button onClick={() => setCurrentPage(2)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
              <Edit3 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <div>
              <p className="font-medium">इच्छा</p>
              <p className="text-gray-600">
                {formData.willingness === 'Yes' ? 'हां' : formData.willingness === 'No' ? 'नहीं' : 'शायद'}
              </p>
            </div>
            <button onClick={() => setCurrentPage(4)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccessGraffiti = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full text-center animate-bounce">
        <div className="relative">
          <div className="absolute -top-4 -left-4 animate-spin">
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </div>
          <div className="absolute -top-2 -right-4 animate-pulse">
            <Star className="h-6 w-6 text-blue-400" />
          </div>
          <div className="absolute -bottom-2 -left-2 animate-bounce">
            <Heart className="h-6 w-6 text-red-400" />
          </div>
          <div className="absolute -bottom-2 -right-2 animate-pulse">
            <MessageSquare className="h-6 w-6 text-green-400" />
          </div>
          
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🎉 शानदार! 🎉
          </h2>
          <p className="text-lg font-semibold text-green-600 mb-2">
            घर सफलतापूर्वक जोड़ा गया!
          </p>
          <p className="text-sm text-blue-600 mb-2 bg-blue-50 px-3 py-1 rounded-full inline-flex items-center">
            📱 SMS भेजा गया है
          </p>
          <p className="text-xs text-gray-500">
            अगले घर के लिए तैयार...
          </p>
        </div>
      </div>
    </div>
  );

  const pages = [renderVillageSelection, renderBasicInfo, renderGoatCounts, renderFemaleGoats, renderMaleGoats, renderWillingness, renderReview];
  const pageNames = ['गांव चुनें', 'बुनियादी जानकारी', 'बकरे की संख्या', 'बकरी की उम्र', 'बकरे की उम्र', 'इच्छा', 'समीक्षा'];

  const canProceed = () => {
    switch (currentPage) {
      case 0:
        return formData.village;
      case 1:
        return formData.hhDidiName && formData.relativeName && formData.community;
      case 2:
        return true; // Can always proceed from goat count page
      case 3:
        return femaleGoatCount === 0 || formData.femaleGoats.every(goat => goat.years > 0 || goat.months > 0);
      case 4:
        return maleGoatCount === 0 || formData.maleGoats.every(goat => goat.years > 0 || goat.months > 0);
      case 5:
        return true;
      case 6:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {showSuccessGraffiti && renderSuccessGraffiti()}
      
      {/* Compact Header with Serial Number */}
      <div className="bg-white p-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-1 rounded">
              #{serialNumber}
            </span>
            <h2 className="text-lg font-semibold">घर जोड़ें</h2>
          </div>
          <span className="text-sm text-gray-500">{currentPage + 1}/{pages.length}</span>
        </div>
        <div className="flex space-x-1 mt-2">
          {pages.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full flex-1 ${
                index <= currentPage ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-1">{pageNames[currentPage]}</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {pages[currentPage]()}
      </div>

      {/* Navigation */}
      <div className="bg-white border-t p-4">
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="flex items-center px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            वापस
          </button>
          
          {currentPage < pages.length - 1 ? (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!canProceed()}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              आगे
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
            >
              <Check className="h-4 w-4 mr-1" />
              जमा करें
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddHHScreen;