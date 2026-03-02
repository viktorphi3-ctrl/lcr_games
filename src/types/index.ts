export type ItemType = 'console' | 'game';

export type ItemCondition = 'CIB' | 'Loose' | 'Sealed' | 'Damaged' | 'Restored';

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  description: string | null;
  release_year: number | null;
  platform: string;
  condition: ItemCondition;
  purchase_price: number;
  image_urls: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ItemFormData {
  type: ItemType;
  title: string;
  description: string;
  release_year: string;
  platform: string;
  condition: ItemCondition;
  purchase_price: string;
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
