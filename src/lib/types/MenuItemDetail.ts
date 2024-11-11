import type { Database } from '$lib/database.types';
import type { MenuWithRelations } from '$lib/types/menu';

type DbAllergen = Database['public']['Tables']['allergens']['Row'];
type DbIngredient = Database['public']['Tables']['ingredients']['Row'];

// Props interface pro MenuItemDetail
export interface MenuDetailProps {
	menu: MenuWithRelations;
	allAllergens: DbAllergen[];
	allIngredients: DbIngredient[];
}

// Event interface pro dispatch
export interface MenuDetailEvents {
	update: MenuWithRelations;
}

// Tag update event interface
export interface TagUpdateEvent {
	tags: DbAllergen[] | DbIngredient[];
}

// Tab types
export type TabType = 'basic' | 'variants' | 'additional';

export interface TabChangeEvent extends Event {
	target: HTMLInputElement & {
		value: TabType;
	};
}