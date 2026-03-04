export type ItemType = 'console' | 'game' | 'accessory';

export type ItemCondition = 'CIB' | 'LOOSE' | 'MINT' | 'RELABEL';

export type ItemBoxCondition = 'sem caixa' | 'com caixa' | 'caixa danificada';

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  description: string | null;
  release_year: number | null;
  platform: string;
  condition: ItemCondition;
  box_condition: ItemBoxCondition | null;
  purchase_price: number;
  market_value: number | null;
  units_sold: number | null;
  developer?: string | null;
  included_items?: string | null;
  image_urls?: string[] | null;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

export interface ItemFormData {
  type: ItemType;
  title: string;
  description: string;
  release_year: string;
  platform: string;
  condition: ItemCondition;
  box_condition: ItemBoxCondition | '';
  purchase_price: string;
  market_value?: string;
  units_sold?: string;
  developer?: string;
  included_items?: string;
}

export interface DashboardStats {
  totalItems: number;
  totalInvested: number;
  totalConsoles: number;
  totalGames: number;
  platformBreakdown: { platform: string; count: number }[];
  recentItems: Item[];
}

export interface CollectionFilters {
  search: string;
  type: ItemType | 'all';
  platform: string;
  condition: ItemCondition | 'all';
  release_year: string;
}
