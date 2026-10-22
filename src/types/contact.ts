export interface AdditionalPhone {
  id: string;
  number: string;
  label: string;
  active: boolean;
}

export interface ContactSettings {
  // Main official phone numbers (أرقام الهواتف الرسمية)
  primaryPhone: string;
  primaryPhoneLabel: string;
  secondaryPhone: string;
  secondaryPhoneLabel: string;
  additionalPhones: AdditionalPhone[];

  // WhatsApp numbers (واتساب مباشر)
  whatsappNumber: string;
  whatsappLabel: string;
  whatsappSecondaryNumber?: string;
  whatsappMessage: string;

  // General business & display info
  sectionTitle: string;
  workingHours: string;
  isAvailableNow: boolean;
  emergencyHotline?: string;

  // Metadata
  updatedAt: string;
  lastUpdatedBy: string;
}

export interface ContactHistoryItem {
  id: string;
  timestamp: string;
  primaryPhone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  note?: string;
}
