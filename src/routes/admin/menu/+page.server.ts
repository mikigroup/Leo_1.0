import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Menu, MenuVersion } from "$lib/types/menu";
import { compareVersions } from "$lib/utils/menuVersioning";

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	try {
		// Parametry pro filtrování a stránkování
		const page = parseInt(url.searchParams.get("page") || "1");
		const itemsPerPage = 10;
		const searchQuery = url.searchParams.get("search") || "";
		const filterDate = url.searchParams.get("date") || "";
		const filterActive = url.searchParams.get("active") || "";

		// Načítáme menu s verzemi a variantami
		let query = supabase
			.from('menus')
			.select(`
                *,
                variants:menu_variants(
                    *,
                    allergens:variant_allergens(allergen:allergens(*)),
                    ingredients:variant_ingredients(ingredient:ingredients(*))
                ),
                currentVersion:menu_versions(*)!inner(valid_to is null),
                allVersions:menu_versions(*),
                count: count(*) over()
            `, { count: 'exact' })
			.eq('deleted', false);

		// Aplikace filtrů
		if (searchQuery) {
			query = query.or(`soup.ilike.%${searchQuery}%,variants.description.ilike.%${searchQuery}%`);
		}

		if (filterDate) {
			query = query.eq('date', filterDate);
		}

		if (filterActive !== '') {
			query = query.eq('active', filterActive === 'true');
		}

		// Stránkování
		const from = (page - 1) * itemsPerPage;
		const to = from + itemsPerPage - 1;

		const { data: menus, error: menusError, count } = await query
			.order('date', { ascending: false })
			.range(from, to);

		if (menusError) {
			console.error('Error loading menus:', menusError);
			throw error(500, 'Chyba při načítání menu');
		}

		// Přidáme informace o změnách
		const menusWithChanges = menus.map(menu => {
			if (menu.allVersions?.length > 1) {
				const changes = compareVersions(
					menu.allVersions[1], // předchozí verze
					menu.allVersions[0]  // aktuální verze
				);

				return {
					...menu,
					currentVersion: menu.currentVersion ? {
						...menu.currentVersion,
						changes
					} : null
				};
			}
			return menu;
		});

		return {
			menus: menusWithChanges,
			pagination: {
				page,
				totalPages: Math.ceil((count || 0) / itemsPerPage),
				totalItems: count,
				itemsPerPage
			},
			filters: {
				search: searchQuery,
				date: filterDate,
				active: filterActive
			}
		};
	} catch (err) {
		console.error('Unexpected error in load function:', err);
		throw error(500, 'Chyba při načítání dat');
	}
};