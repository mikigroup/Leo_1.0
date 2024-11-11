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
		const itemsPerPage = 10;
		const searchQuery = url.searchParams.get("search") || "";
		const filterDate = url.searchParams.get("date") || "";
		const filterActive = url.searchParams.get("active") || "";

		let query = supabase
			.from('menus')
			.select(`
        *,
        variants:menu_variants(
          *,
          allergens:variant_allergens(allergen:allergens(*)),
          ingredients:variant_ingredients(ingredient:ingredients(*))
        ),
        currentVersion:menu_versions!current_version(*),
        allVersions:menu_versions(*),
        count: count(*) over()
      `, { count: 'exact' })
			.eq('deleted', false);

		if (searchQuery) {
			query = query.or(`soup.ilike.%${searchQuery}%,variants.description.ilike.%${searchQuery}%`);
		}

		if (filterDate) {
			query = query.eq('date', filterDate);
		}

		if (filterActive !== '') {
			query = query.eq('active', filterActive === 'true');
		}

		const from = (page - 1) * itemsPerPage;
		const to = from + itemsPerPage - 1;

		const { data: menus, error: menusError, count } = await query
			.order('date', { ascending: false })
			.range(from, to) as MenuResponse;

		if (menusError) {
			console.error('Error loading menus:', menusError);
			throw error(500, 'Chyba při načítání menu');
		}

		const menusWithChanges = menus.map(menu => {
			if (menu.allVersions?.length > 1) {
				const changes = compareVersions(
					menu.allVersions[1],
					menu.allVersions[0]
				);

				return {
					...menu,
					currentVersion: menu.currentVersion?.[0] ? {
						...menu.currentVersion[0],
						changes
					} : null
				};
			}
			return {
				...menu,
				currentVersion: menu.currentVersion?.[0] || null
			};
		});

		const result: MenuLoadData = {
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

		return result;
	} catch (err) {
		console.error('Unexpected error in load function:', err);
		throw error(500, 'Chyba při načítání dat');
	}
}) satisfies PageServerLoad;