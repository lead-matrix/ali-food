// Localization dictionaries for M/S Ali Food platform
// Supports English as default with structure ready for Bangla (BN) toggle

export type Locale = 'en' | 'bn';

export const i18n = {
  en: {
    company: {
      name: 'M/S Ali Food',
      tagline: 'Your Trusted Meat Source',
      subtitle: 'Wholesale Poultry, Meat & Dressed Cuts Partner',
      positioning: 'Commercial poultry processor & institutional wholesale meat supplier in Bangladesh',
      proprietor: 'AL ISLAM RIDHOY',
      proprietorTitle: 'Proprietor',
      recordRef: 'AF/CORP/2026',
      vendorCode: 'AF-INST-2026/09',
    },
    nav: {
      home: 'Home',
      whatWeSupply: 'What We Supply',
      about: 'About Us',
      contact: 'Contact',
      clientLogin: 'Client Portal',
      admin: 'Admin',
      logout: 'Logout',
    },
    common: {
      call: 'Call',
      hotline: 'Hotline',
      whatsapp: 'WhatsApp',
      email: 'Email',
      dhakaHub: 'Dhaka Central Hub',
      ctgHub: 'Chattogram Regional Hub',
      currency: '৳',
      viewAllProducts: 'View All Products',
      inquireWhatsApp: 'Inquire on WhatsApp',
      requestQuote: 'Rate upon inquiry',
    },
    whyUs: {
      title: 'Why M/S Ali Food',
      subtitle: 'Engineered for reliability, food safety, and transparent business operations.',
      point1Title: 'Active Cold Chain',
      point1Desc: 'Strict 0°C–4°C chilled bath processing and temperature-controlled pre-dawn dispatch (5:00 AM – 8:00 AM).',
      point2Title: 'Consistent Institutional Supply',
      point2Desc: 'Contract-grown healthy flocks, certified Halal slaughter, and precision culinary cuts calibrated to chef specs.',
      point3Title: 'Flexible Billing & Statements',
      point3Desc: 'Structured weekly or monthly settlement accounts with delivery challans and detailed statement reporting.',
    },
  },
  bn: {
    company: {
      name: 'মেসার্স আলী ফুড',
      tagline: 'আপনার বিশ্বস্ত মাংস সরবরাহকারী',
      subtitle: 'পাইকারি পোল্ট্রি, মাংস ও ড্রেসড কাটস পার্টনার',
      positioning: 'বাণিজ্যিক পোল্ট্রি প্রসেসর এবং প্রাতিষ্ঠানিক পাইকারি মাংস সরবরাহকারী',
      proprietor: 'আল ইসলাম হৃদয়',
      proprietorTitle: 'স্বত্বাধিকারী',
      recordRef: 'AF/CORP/2026',
      vendorCode: 'AF-INST-2026/09',
    },
    nav: {
      home: 'হোম',
      whatWeSupply: 'পণ্যসমূহ',
      about: 'আমাদের সম্পর্কে',
      contact: 'যোগাযোগ',
      clientLogin: 'ক্লায়েন্ট পোর্টাল',
      admin: 'অ্যাডমিন',
      logout: 'লগআউট',
    },
    common: {
      call: 'কল',
      hotline: 'হটলাইন',
      whatsapp: 'হোয়াটসঅ্যাপ',
      email: 'ইমেইল',
      dhakaHub: 'ঢাকা সেন্ট্রাল হাব',
      ctgHub: 'চট্টগ্রাম রিজিওনাল হাব',
      currency: '৳',
      viewAllProducts: 'সকল পণ্য দেখুন',
      inquireWhatsApp: 'হোয়াটসঅ্যাপে জানুন',
      requestQuote: 'যোগাযোগ সাপেক্ষে রেট',
    },
    whyUs: {
      title: 'কেন আলী ফুড',
      subtitle: 'নির্ভরযোগ্যতা, খাদ্য নিরাপত্তা এবং স্বচ্ছ বাণিজ্যিক লেনদেনের প্রতিশ্রুতি।',
      point1Title: 'অবিচ্ছিন্ন কোল্ড চেইন',
      point1Desc: '০°C–৪°C নিয়ন্ত্রিত তাপমাত্রা এবং প্রত্যুষে (সকাল ৫টা–৮টা) নিশ্চিত ডেলিভারি।',
      point2Title: 'ধারাবাহিক প্রাতিষ্ঠানিক সরবরাহ',
      point2Desc: 'বায়ো-সিকিউর কন্ট্রাক্ট ফার্মিং, ১০০% হালাল জবাই ও সুনির্দিষ্ট শেফ-স্পেসিফিকেশন কাটিং।',
      point3Title: 'সাপ্তাহিক / মাসিক বিলিং সুবিধা',
      point3Desc: 'প্রাতিষ্ঠানিক চুক্তিভিত্তিক বিলিং ও চালানের মাধ্যমে স্বচ্ছ হিসাব ব্যবস্থা।',
    },
  },
};

export const t = i18n.en;
