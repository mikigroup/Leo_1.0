import type { Database } from '$lib/database.types';
import type { Menu, MenuVariant } from '$lib/types/menu';

type DbAllergen = Database['public']['Tables']['allergens']['Row'];
type DbIngredient = Database['public']['Tables']['ingredients']['Row'];

// Props interface pro MenuItemDetail
export interface MenuDetailProps {
	menu: Menu;
	allAllergens: DbAllergen[];
	allIngredients: DbIngredient[];
}

// Event interface pro dispatch
export interface MenuDetailEvents {
	update: Menu;
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