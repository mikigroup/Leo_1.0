import type { Database } from "$lib/database.types";

// Základní typy z databáze
type BaseMenu = Database["public"]["Tables"]["menus"]["Row"];
type BaseMenuVariant = Database["public"]["Tables"]["menu_variants"]["Row"];
type BaseMenuVersion = Database["public"]["Tables"]["menu_versions"]["Row"];
type BaseAllergen = Database["public"]["Tables"]["allergens"]["Row"];
type BaseIngredient = Database["public"]["Tables"]["ingredients"]["Row"];

export type ChangeType = 'added' | 'removed' | 'modified';

export interface VersionChange {
	fieldName: string;
	oldValue: any;
	newValue: any;
	type: ChangeType;
}

// Rozšířený typ pro verze
export interface MenuVersion extends BaseMenuVersion {
	soup: string | null;
	active: boolean | null;
	notes: string | null;
	type: string | null;
	nutri: string | null;
	[key: string]: any; // Pro dynamický přístup k polím
}

// Rozšířený typ pro verze s možnými změnami
export interface MenuVersionWithChanges extends MenuVersion {
	changes?: VersionChange[];
}

// Export dalších typů...
export interface MenuWithRelations extends BaseMenu {
	variants: MenuVariantWithRelations[];
	currentVersion: MenuVersionWithChanges[];
	allVersions: MenuVersion[];
}

// Rozšířený typ pro varianty s alergeny a ingrediencemi
export interface MenuVariantWithRelations extends BaseMenuVariant {
	allergens: {
		allergen: BaseAllergen;
	}[];
	ingredients: {
		ingredient: BaseIngredient;
	}[];
}

// Rozšířený typ pro verze s možnými změnami
export interface MenuVersionWithChanges extends BaseMenuVersion {
	changes?: {
		field: string;
		oldValue: any;
		newValue: any;
	}[];
}

// Hlavní typ pro menu s relacemi
export interface MenuWithRelations extends BaseMenu {
	variants: MenuVariantWithRelations[];
	currentVersion: MenuVersionWithChanges[];
	allVersions: BaseMenuVersion[];
}

// Typ pro response z DB včetně počtu
export interface MenuResponse {
	data: MenuWithRelations[];
	count: number | null;
	error: any;
}

// Typ pro pagination
export interface PaginationData {
	page: number;
	totalPages: number;
	totalItems: number | null;
	itemsPerPage: number;
}

// Typ pro filtry
export interface MenuFilters {
	search: string;
	date: string;
	active: string;
}

// Kompletní návratový typ pro load funkci
export interface MenuLoadData {
	menus: (MenuWithRelations & {
		currentVersion: MenuVersionWithChanges | null;
	})[];
	pagination: PaginationData;
	filters: MenuFilters;
}