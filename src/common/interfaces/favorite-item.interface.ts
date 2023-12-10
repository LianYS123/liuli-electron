// src/common/api/favoriteItem.ts
import { ItemType } from '../constants';

export interface FavoriteItem {
  id?: number;
  title: string;
  url?: string;
  description?: string;
  type: ItemType;
  parentId?: number; // Optional reference to the parent item
  // Any extra properties can be added here
}