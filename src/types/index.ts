export type ProductCategory = 
  | 'waterfowl_game_squab'
  | 'broiler_cuts'
  | 'indigenous_birds'
  | 'live_poultry';

export type SupplyForm = 
  | 'Chilled/Frozen'
  | 'Fresh Dressed'
  | 'Chilled/Live'
  | 'Fresh Chilled'
  | 'Chilled Fillet'
  | 'Chilled Fresh'
  | 'Chilled Offal'
  | 'Skinless Dressed'
  | 'Whole Dressed'
  | 'Live Weight';

export type CutType = 'all' | 'boneless' | 'with-bone' | 'skinless' | 'with-skin' | 'whole' | 'live';

export interface Product {
  id: string;
  sl: number;
  name: string;
  slug: string;
  category: ProductCategory;
  categoryName: string;
  description: string;
  processingSpecification: string;
  supplyForm: SupplyForm;
  unit: 'Kg' | 'Piece';
  rate: number;
  currency: string;
  priceVisible: boolean; // toggle between Show Price or Request Quote
  active: boolean;
  minQuantity: number;
  imageUrl: string;
  tags: string[];
  isBoneless?: boolean;
  hasSkin?: boolean;
  isSpecialty?: boolean;
  isLive?: boolean;
  temperature: 'Chilled' | 'Frozen' | 'Fresh' | 'Live';
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  priceVisible: boolean;
  subtotal: number;
  customNotes?: string;
  imageUrl?: string;
  specification?: string;
}

export type CustomerType = 
  | 'Restaurant'
  | 'Catering'
  | 'Supermarket'
  | 'Corporate Kitchen'
  | 'Food Service'
  | 'Wholesale Buyer'
  | 'Other';

export type OrderStatus = 
  | 'New'
  | 'Confirmed'
  | 'Processing'
  | 'Ready'
  | 'Dispatched'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string; // e.g. AF-2026-000123
  customerName: string;
  companyName: string;
  customerType: CustomerType;
  phone: string;
  whatsapp: string;
  email: string;
  deliveryCity: 'Dhaka' | 'Chattogram';
  deliveryArea: string;
  deliveryAddress: string;
  preferredDate: string;
  preferredTimeSlot: '5:00 AM - 8:00 AM (Pre-dawn Route)' | '8:00 AM - 12:00 PM (Morning Express)' | '12:00 PM - 4:00 PM (Afternoon Delivery)';
  specialInstructions: string;
  items: OrderItem[];
  estimatedTotal: number;
  hasQuoteItems: boolean;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SupplyPartner {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  tag: string;
}

export interface CustomCutInquiry {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  birdType: string;
  cutSpecification: string;
  skinPreference: 'Skinless' | 'Skin-on' | 'Either';
  bonePreference: 'Boneless' | 'Bone-in' | 'Either';
  packagingPreference: string;
  estimatedVolumeKg: number;
  frequency: 'Daily' | 'Weekly' | 'Bi-weekly' | 'One-time';
  deliveryCity: 'Dhaka' | 'Chattogram';
  deliveryAddress: string;
  notes: string;
  createdAt: string;
}
