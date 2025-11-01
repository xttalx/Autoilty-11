export interface CountryConfig {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  language: 'en' | 'ms' | 'id' | 'th';
  categories: {
    id: string;
    name: string;
    nameLocalized: Record<string, string>;
    icon: string;
  }[];
  makes: string[];
  popularCities: string[];
  forumCategories: string[];
}

export const countries: Record<string, CountryConfig> = {
  CA: {
    code: 'CA',
    name: 'Canada',
    currency: 'CAD',
    currencySymbol: '$',
    locale: 'en-CA',
    language: 'en',
    categories: [
      { id: 'mechanics', name: 'Mechanics', nameLocalized: { en: 'Mechanics', ms: 'Mekanik', id: 'Montir', th: 'ช่าง' }, icon: '🔧' },
      { id: 'dealerships', name: 'Dealerships', nameLocalized: { en: 'Dealerships', ms: 'Pengedar', id: 'Dealer', th: 'ตัวแทนจำหน่าย' }, icon: '🚗' },
      { id: 'auto-parts', name: 'Auto Parts', nameLocalized: { en: 'Auto Parts', ms: 'Alat Ganti', id: 'Suku Cadang', th: 'อะไหล่' }, icon: '⚙️' },
      { id: 'detailing', name: 'Detailing', nameLocalized: { en: 'Detailing', ms: 'Penyelenggaraan', id: 'Detailing', th: 'ทำความสะอาด' }, icon: '✨' },
      { id: 'tire-centers', name: 'Tire Centers', nameLocalized: { en: 'Tire Centers', ms: 'Pusat Tayar', id: 'Toko Ban', th: 'ร้านยาง' }, icon: '🛞' },
    ],
    makes: ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen'],
    popularCities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton', 'Ottawa'],
    forumCategories: ['General Discussion', 'Buy/Sell', 'Modifications', 'Maintenance', 'Reviews'],
  },
  SG: {
    code: 'SG',
    name: 'Singapore',
    currency: 'SGD',
    currencySymbol: 'S$',
    locale: 'en-SG',
    language: 'en',
    categories: [
      { id: 'mechanics', name: 'Mechanics', nameLocalized: { en: 'Mechanics', ms: 'Mekanik', id: 'Montir', th: 'ช่าง' }, icon: '🔧' },
      { id: 'dealerships', name: 'Dealerships', nameLocalized: { en: 'Dealerships', ms: 'Pengedar', id: 'Dealer', th: 'ตัวแทนจำหน่าย' }, icon: '🚗' },
      { id: 'auto-parts', name: 'Auto Parts', nameLocalized: { en: 'Auto Parts', ms: 'Alat Ganti', id: 'Suku Cadang', th: 'อะไหล่' }, icon: '⚙️' },
      { id: 'detailing', name: 'Detailing', nameLocalized: { en: 'Detailing', ms: 'Penyelenggaraan', id: 'Detailing', th: 'ทำความสะอาด' }, icon: '✨' },
      { id: 'tire-centers', name: 'Tire Centers', nameLocalized: { en: 'Tire Centers', ms: 'Pusat Tayar', id: 'Toko Ban', th: 'ร้านยาง' }, icon: '🛞' },
      { id: 'cof-renewal', name: 'COE Renewal', nameLocalized: { en: 'COE Renewal', ms: 'Pembaharuan COE', id: 'Perpanjangan COE', th: 'ต่ออายุ COE' }, icon: '📄' },
      { id: 'inspection', name: 'Inspection', nameLocalized: { en: 'Inspection', ms: 'Pemeriksaan', id: 'Pemeriksaan', th: 'ตรวจสอบ' }, icon: '🔍' },
    ],
    makes: ['Toyota', 'Honda', 'Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen', 'Mazda', 'Hyundai'],
    popularCities: ['Singapore Central', 'Orchard', 'Jurong', 'Tampines', 'Woodlands', 'Punggol'],
    forumCategories: ['COE Discussion', 'Car Reviews', 'Buy/Sell', 'Modifications', 'Maintenance Tips', 'Singapore Car Culture'],
  },
  MY: {
    code: 'MY',
    name: 'Malaysia',
    currency: 'MYR',
    currencySymbol: 'RM',
    locale: 'ms-MY',
    language: 'ms',
    categories: [
      { id: 'mechanics', name: 'Mechanics', nameLocalized: { en: 'Mechanics', ms: 'Mekanik', id: 'Montir', th: 'ช่าง' }, icon: '🔧' },
      { id: 'dealerships', name: 'Dealerships', nameLocalized: { en: 'Dealerships', ms: 'Pengedar', id: 'Dealer', th: 'ตัวแทนจำหน่าย' }, icon: '🚗' },
      { id: 'auto-parts', name: 'Auto Parts', nameLocalized: { en: 'Auto Parts', ms: 'Alat Ganti', id: 'Suku Cadang', th: 'อะไหล่' }, icon: '⚙️' },
      { id: 'detailing', name: 'Detailing', nameLocalized: { en: 'Detailing', ms: 'Penyelenggaraan', id: 'Detailing', th: 'ทำความสะอาด' }, icon: '✨' },
      { id: 'tire-centers', name: 'Tire Centers', nameLocalized: { en: 'Tire Centers', ms: 'Pusat Tayar', id: 'Toko Ban', th: 'ร้านยาง' }, icon: '🛞' },
      { id: 'road-tax', name: 'Road Tax', nameLocalized: { en: 'Road Tax', ms: 'Cukai Jalan', id: 'Pajak Jalan', th: 'ภาษีถนน' }, icon: '📋' },
      { id: 'insurance', name: 'Insurance', nameLocalized: { en: 'Insurance', ms: 'Insurans', id: 'Asuransi', th: 'ประกัน' }, icon: '🛡️' },
    ],
    makes: ['Perodua', 'Proton', 'Toyota', 'Honda', 'Nissan', 'Mazda', 'Mercedes-Benz', 'BMW'],
    popularCities: ['Kuala Lumpur', 'Johor Bahru', 'Penang', 'Malacca', 'Shah Alam', 'Petaling Jaya'],
    forumCategories: ['Proton/Perodua Discussion', 'Car Reviews', 'Buy/Sell', 'Modifications', 'Road Tax & Insurance', 'Malaysian Car Culture'],
  },
  ID: {
    code: 'ID',
    name: 'Indonesia',
    currency: 'IDR',
    currencySymbol: 'Rp',
    locale: 'id-ID',
    language: 'id',
    categories: [
      { id: 'mechanics', name: 'Mechanics', nameLocalized: { en: 'Mechanics', ms: 'Mekanik', id: 'Montir', th: 'ช่าง' }, icon: '🔧' },
      { id: 'dealerships', name: 'Dealerships', nameLocalized: { en: 'Dealerships', ms: 'Pengedar', id: 'Dealer', th: 'ตัวแทนจำหน่าย' }, icon: '🚗' },
      { id: 'auto-parts', name: 'Auto Parts', nameLocalized: { en: 'Auto Parts', ms: 'Alat Ganti', id: 'Suku Cadang', th: 'อะไหล่' }, icon: '⚙️' },
      { id: 'detailing', name: 'Detailing', nameLocalized: { en: 'Detailing', ms: 'Penyelenggaraan', id: 'Detailing', th: 'ทำความสะอาด' }, icon: '✨' },
      { id: 'tire-centers', name: 'Tire Centers', nameLocalized: { en: 'Tire Centers', ms: 'Pusat Tayar', id: 'Toko Ban', th: 'ร้านยาง' }, icon: '🛞' },
      { id: 'flood-proof', name: 'Flood Proofing', nameLocalized: { en: 'Flood Proofing', ms: 'Anti Banjir', id: 'Anti Banjir', th: 'ป้องกันน้ำท่วม' }, icon: '🌊' },
      { id: 'emission-test', name: 'Emission Test', nameLocalized: { en: 'Emission Test', ms: 'Ujian Pelepasan', id: 'Uji Emisi', th: 'ทดสอบมลพิษ' }, icon: '🌱' },
    ],
    makes: ['Toyota', 'Daihatsu', 'Honda', 'Suzuki', 'Mitsubishi', 'Nissan', 'Wuling', 'Hyundai'],
    popularCities: ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar'],
    forumCategories: ['Flood-Proof Mods', 'Car Reviews', 'Buy/Sell', 'Modifications', 'Maintenance', 'Indonesian Car Community'],
  },
  TH: {
    code: 'TH',
    name: 'Thailand',
    currency: 'THB',
    currencySymbol: '฿',
    locale: 'th-TH',
    language: 'th',
    categories: [
      { id: 'mechanics', name: 'Mechanics', nameLocalized: { en: 'Mechanics', ms: 'Mekanik', id: 'Montir', th: 'ช่าง' }, icon: '🔧' },
      { id: 'dealerships', name: 'Dealerships', nameLocalized: { en: 'Dealerships', ms: 'Pengedar', id: 'Dealer', th: 'ตัวแทนจำหน่าย' }, icon: '🚗' },
      { id: 'auto-parts', name: 'Auto Parts', nameLocalized: { en: 'Auto Parts', ms: 'Alat Ganti', id: 'Suku Cadang', th: 'อะไหล่' }, icon: '⚙️' },
      { id: 'detailing', name: 'Detailing', nameLocalized: { en: 'Detailing', ms: 'Penyelenggaraan', id: 'Detailing', th: 'ทำความสะอาด' }, icon: '✨' },
      { id: 'tire-centers', name: 'Tire Centers', nameLocalized: { en: 'Tire Centers', ms: 'Pusat Tayar', id: 'Toko Ban', th: 'ร้านยาง' }, icon: '🛞' },
      { id: 'first-car-tax', name: 'First Car Tax', nameLocalized: { en: 'First Car Tax', ms: 'Cukai Kereta Pertama', id: 'Pajak Mobil Pertama', th: 'ภาษีรถคันแรก' }, icon: '🎁' },
      { id: 'insurance', name: 'Insurance', nameLocalized: { en: 'Insurance', ms: 'Insurans', id: 'Asuransi', th: 'ประกัน' }, icon: '🛡️' },
    ],
    makes: ['Toyota', 'Honda', 'Isuzu', 'Mazda', 'Nissan', 'Mitsubishi', 'Ford', 'Chevrolet'],
    popularCities: ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Hat Yai', 'Khon Kaen'],
    forumCategories: ['Car Reviews', 'Buy/Sell', 'Modifications', 'Maintenance', 'Thailand Car Culture', 'First Car Program'],
  },
};

export const getCountryConfig = (countryCode: string): CountryConfig => {
  return countries[countryCode.toUpperCase()] || countries.CA;
};

export const formatCurrency = (amount: number, countryCode: string): string => {
  const config = getCountryConfig(countryCode);
  const formatter = new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
};

