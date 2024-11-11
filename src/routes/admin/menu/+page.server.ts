// +page.server.ts
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { compareVersions } from "$lib/utils/menuVersioning";
import type {
	MenuWithRelations,
	MenuResponse,
	MenuLoadData,
	MenuVersionWithChanges
} from "$lib/types/menu";

export const load = (async ({ locals: { supabase }, url }) => {
	try {
		const page = parseInt(url.searchParams.get("page") || "1");
		const itemsPerPage = parseInt(url.searchParams.get("pageSize") || "10");
		const searchQuery = url.searchParams.get("search") || "";
		const filterDate = url.searchParams.get("date") || "";
		const filterActive = url.searchParams.get("active") || "";

		const from = (page - 1) * itemsPerPage;
		const to = from + itemsPerPage - 1;

		// Nejdřív sestavíme základní dotaz
		let query = supabase
			.from('menus')
			.select(`
        *,
        variants:menu_variants (
          id,
          variant_number,
          description,
          price,
          allergens:variant_allergens (
            allergen:allergens (*)
          ),
          ingredients:variant_ingredients (
            ingredient:ingredients (*)
          )
        ),
        current_version:menu_versions (*)
      `, { count: 'exact' })
			.eq('deleted', false);

		// Přidáme filtry
		if (searchQuery) {
			query = query.or(`soup.ilike.%${searchQuery}%,variants.description.ilike.%${searchQuery}%`);
		}

		if (filterDate) {
			query = query.eq('date', filterDate);
		}

		if (filterActive !== '') {
			query = query.eq('active', filterActive === 'true');
		}

		// Dokončíme dotaz s řazením a stránkováním
		const { data: menus, error: menusError, count } = await query
			.order('date', { ascending: false })
			.range(from, to);

		if (menusError) {
			console.error('Error loading menus:', menusError);
			throw error(500, 'Chyba při načítání menu');
		}

		// Zpracování verzí a změn
		const processedMenus = menus?.map(menu => {
			const currentVersion = menu.current_version?.[0];
			const changes = currentVersion ? {
				modified: [], // Zde můžete implementovat logiku pro detekci změn
				added: []
			} : null;

			return {
				...menu,
				currentVersion: currentVersion ? {
					...currentVersion,
					changes
				} : null
			};
		}) || [];

		return {
			menus: processedMenus,
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
}) satisfies PageServerLoad;