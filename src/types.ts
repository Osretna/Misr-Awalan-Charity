export type ProjectCategory = 
  | 'orphans' 
  | 'education' 
  | 'health' 
  | 'housing' 
  | 'food' 
  | 'water' 
  | 'mosques' 
  | 'seasonal';

export interface Project {
  id: string;
  title: string;
  titleEn?: string;
  category: ProjectCategory;
  categoryEn?: string;
  shortDescription: string;
  shortDescriptionEn?: string;
  fullDescription: string;
  fullDescriptionEn?: string;
  coverImage: string;
  galleryImages?: string[];
  videoUrl?: string; // YouTube / Vimeo / Google Drive link
  location: string;
  targetAmount?: number;
  raisedAmount?: number;
  beneficiaries?: number;
  isFeatured: boolean;
  status: 'active' | 'completed' | 'ongoing';
  createdAt: string;
  updatedAt?: string;
}

export type PaymentMethod = 'instapay' | 'vodafone_cash' | 'fawry' | 'bank_transfer' | 'oppay' | 'sms' | 'card' | 'representative';

export interface Donation {
  id: string;
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  amount: number;
  currency: 'EGP' | 'USD';
  campaignId?: string;
  campaignTitle: string;
  type: 'one-time' | 'monthly';
  paymentMethod: PaymentMethod;
  status: 'completed' | 'pending';
  referenceNumber: string;
  isPublic: boolean;
  createdAt: string;
}

export interface Volunteer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  skills: string;
  availability: string;
  notes?: string;
  status: 'pending' | 'contacted' | 'approved';
  createdAt: string;
}

export interface ImpactStats {
  familiesHelped: number;
  mealsDistributed: number;
  orphansSponsored: number;
  waterWellsBuilt: number;
  medicalConvoys: number;
  homesRestored: number;
  lastUpdated: string;
}

export interface NewsItem {
  id: string;
  title: string;
  titleEn?: string;
  summary: string;
  summaryEn?: string;
  content: string;
  contentEn?: string;
  imageUrl: string;
  date: string;
  category: string;
  createdAt: string;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  iban?: string;
  swift?: string;
  currency?: string;
}

export interface OrganizationValue {
  id: string;
  title: string;
  desc: string;
  icon?: string;
}

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
}

export interface SiteSettings {
  logoUrl: string;
  orgNameAr: string;
  orgNameEn: string;
  sloganAr: string;
  sloganEn: string;
  licenseNumber: string;
  phone1: string;
  phone2: string;
  hotline: string;
  whatsappNumber: string;
  officialEmail: string;
  address: string;
  taxNumber: string;
  
  // Quick payment specifics from official license card
  opPayCode: string;
  vodafoneCashCode: string;
  smsNumber: string;
  instaPayAddress: string;

  // About Organization sections
  aboutBrief: string;
  aboutVision: string;
  aboutMission: string;
  aboutHistory: string;
  values: OrganizationValue[];
  boardMembers: BoardMember[];

  // SEO & Hero
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  heroHeadline: string;
  heroSubheadline: string;
  bankAccounts: BankAccount[];
}
