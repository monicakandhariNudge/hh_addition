export interface User {
  phone: string;
  role: 'PS' | 'GM' | 'OTHER';
}

export interface HouseHold {
  id: string;
  serialNumber: number;
  village: string;
  hhDidiName: string;
  relativeName: string;
  phoneNumber: string;
  community: 'General' | 'SC' | 'ST' | 'OBC' | 'Minority/Muslim';
  femaleGoats: Array<{ months: number; years: number }>;
  maleGoats: Array<{ months: number; years: number }>;
  willingness: 'Yes' | 'No' | 'Maybe';
  syncStatus: 'synced' | 'pending' | 'error';
  createdAt: Date;
}

export interface DuplicateConflict {
  new: HouseHold;
  existing: HouseHold;
}