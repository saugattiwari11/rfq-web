export type BusinessType = 'supplier' | 'retailer' | 'electrician';
export type VerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected' | 'suspended';

export interface Business {
  id: string;
  business_name: string;
  business_type: BusinessType;
  city: string;
  verification_status: VerificationStatus;
}

export interface RequirementItem {
  id: string;
  category_id: string;
  category_name?: string;
  brand_preference: string | null;
  specification: string | null;
  quantity: number;
}

export interface Requirement {
  id: string;
  title: string;
  city: string;
  status: 'open' | 'closed' | 'expired';
  required_by: string | null;
  expires_at: string;
  notes: string | null;
  created_at: string;
  items: RequirementItem[];
}

export interface QuotationItem {
  id: string;
  requirement_item_id: string;
  brand: string | null;
  model: string | null;
  unit_price: number;
  quantity_available: number;
}

export interface Quotation {
  id: string;
  requirement_id: string;
  seller_business_id: string;
  seller_name?: string;
  delivery_charge: number;
  discount: number;
  delivery_time: string | null;
  warranty: string | null;
  payment_terms: string | null;
  valid_until: string | null;
  status: 'submitted' | 'selected' | 'expired' | 'withdrawn';
  items: QuotationItem[];
}
