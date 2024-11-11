import type { Database } from "$lib/database.types";

// Základní typy z databáze
export type Menu = Database["public"]["Tables"]["menus"]["Row"];
export type MenuVariant = Database["public"]["Tables"]["menu_variants"]["Row"];
type BaseMenuVersion = Database["public"]["Tables"]["menu_versions"]["Row"];
type BaseAllergen = Database["public"]["Tables"]["allergens"]["Row"];
type BaseIngredient = Database["public"]["Tables"]["ingredients"]["Row"];

// Základní rozhraní pro tagy
export interface BaseTag {
	id: number;
	name: string;
	created_at?: string | null;
	updated_at?: string | null;
}

// Definice typů pro alergeny a ingredience
export interface Allergen extends BaseTag {}
export interface Ingredient extends BaseTag {}

// Rozšířený typ pro relace alergenů a ingrediencí
export interface AllergenRelation {
	allergen: Allergen;
}

export interface IngredientRelation {
	ingredient: Ingredient;
}

// Rozšířený typ pro varianty s alergeny a ingrediencemi
export type MenuVariantWithRelations = MenuVariant & {
	allergens: Allergen[];
	ingredients: Ingredient[];
	menu_version_id?: string | null;
};

// Typy pro verzování a změny
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
	allergens: Allergen[];
	ingredients: Ingredient[];
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
	allAllergens: Allergen[];
	allIngredients: Ingredient[];
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
	tags: Allergen[] | Ingredient[];
	type: 'allergen' | 'ingredient';
}

// Helper types pro práci s tagy
export type TagType = 'allergen' | 'ingredient';

export interface TagSelectionEvent {
	type: TagType;
	tags: Allergen[] | Ingredient[];
}