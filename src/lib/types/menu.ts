import type { Database } from '$lib/database.types';

type DbMenu = Database['public']['Tables']['menus']['Row'];
type DbMenuVersion = Database['public']['Tables']['menu_versions']['Row'];
type DbMenuVariant = Database['public']['Tables']['menu_variants']['Row'];
type DbAllergen = Database['public']['Tables']['allergens']['Row'];
type DbIngredient = Database['public']['Tables']['ingredients']['Row'];

export interface MenuVersion extends DbMenuVersion {
	changes?: {
		added?: string[];
		removed?: string[];
		modified?: string[];
	};
	status?: 'active' | 'archived';
}

export interface MenuVariant extends DbMenuVariant {
	allergens: DbAllergen[];
	ingredients: DbIngredient[];
}

export interface Menu extends DbMenu {
	currentVersion?: MenuVersion;
	allVersions?: MenuVersion[];
	variants: MenuVariant[];
}

export interface VersionChange {
	fieldName: string;
	oldValue: any;
	newValue: any;
	type: 'added' | 'removed' | 'modified';
}