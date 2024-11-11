import type { Database } from "$lib/database.types";

// Základní typy z databáze
export type Menu = Database["public"]["Tables"]["menus"]["Row"];
export type MenuVariant = Database["public"]["Tables"]["menu_variants"]["Row"];
type BaseMenuVersion = Database["public"]["Tables"]["menu_versions"]["Row"];
type BaseAllergen = Database["public"]["Tables"]["allergens"]["Row"];
type BaseIngredient = Database["public"]["Tables"]["ingredients"]["Row"];

// Rozšířený typ pro alergeny a ingredience
export interface AllergenRelation {
	allergen: BaseAllergen;
}

export interface IngredientRelation {
	ingredient: BaseIngredient;
}

// Rozšířený typ pro varianty s alergeny a ingrediencemi
// Opraveno: použijeme intersection type místo extends
export type MenuVariantWithRelations = MenuVariant & {
	allergens: AllergenRelation[];
	ingredients: IngredientRelation[];
	menu_version_id?: string | null;
};

// Typy pro změny verzí
export type ChangeType = 'added' | 'removed' | 'modified';
export type MenuVersionField = 'soup' | 'active' | 'notes' | 'type' | 'nutri';

// Rozšířený typ pro verze
export interface MenuVersion extends BaseMenuVersion {
	soup: string | null;
	active: boolean | null;
	notes: string | null;
	type: string | null;
	nutri: string | null;
	[key: string]: any;
}

export interface VersionChange {
	fieldName: MenuVersionField;
	oldValue: any;
	newValue: any;
	type: ChangeType;
}

export interface MenuVersionWithChanges extends MenuVersion {
	changes?: {
		modified?: string[];
		added?: string[];
		removed?: string[];
	};
}

// Rozšířený typ pro menu s relacemi
export type MenuWithRelations = Menu & {
	variants: MenuVariantWithRelations[];
	currentVersion: MenuVersionWithChanges[] | null;
	allVersions: MenuVersion[];
};

// Response typy pro API
export interface MenuResponse {
	data: MenuWithRelations[];
	count: number | null;
	error: any;
}

// Typy pro stránkování
export interface PaginationData {
	page: number;
	totalPages: number;
	totalItems: number | null;
	itemsPerPage: number;
}

// Typy pro filtry
export interface MenuFilters {
	search: string;
	date: string;
	active: string;
}

// Hlavní typ pro načtená data
export interface MenuLoadData {
	menus: (MenuWithRelations & {
		currentVersion: MenuVersionWithChanges | null;
	})[];
	pagination: PaginationData;
	filters: MenuFilters;
}

// Typy pro komponenty
export interface MenuDetailProps {
	menu: MenuWithRelations;
	allAllergens: BaseAllergen[];
	allIngredients: BaseIngredient[];
}

export interface MenuDetailEvents {
	update: MenuWithRelations;
}

export type TabType = 'basic' | 'variants' | 'additional';

export interface TabChangeEvent extends Event {
	target: HTMLInputElement & {
		value: TabType;
	};
}

export interface TagUpdateEvent {
	tags: BaseAllergen[] | BaseIngredient[];
	type: 'allergen' | 'ingredient';
}