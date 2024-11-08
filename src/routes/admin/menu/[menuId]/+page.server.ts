// src/routes/admin/menu/[menuId]/+page.server.ts
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals: { supabase }, url }) => {
	const { menuId } = params;
	const date = url.searchParams.get('date');

	try {
		// 1. Načtení aktuální nebo historické verze menu
		const { data: menuVersion, error: versionError } = await supabase
			.rpc('get_menu_version_at_date', {
				p_menu_id: menuId,
				p_date: date || 'now'
			});

		if (versionError) throw error(404, "Menu version not found");

		// 2. Načtení detailů menu včetně variant, alergenů a ingrediencí
		const { data: menu, error: menuError } = await supabase
			.from("menus")
			.select(`
        *,
        variants:menu_variants(
          *,
          allergens:variant_allergens(allergen:allergens(*)),
          ingredients:variant_ingredients(ingredient:ingredients(*))
        ),
        versions:menu_versions(*)
      `)
			.eq("id", menuId)
			.single();

		if (menuError) throw error(404, "Menu not found");

		// 3. Načtení všech verzí pro timeline
		const { data: versions, error: versionsError } = await supabase
			.from("menu_versions")
			.select("*")
			.eq("menu_id", menuId)
			.order("valid_from", { ascending: false });

		if (versionsError) throw error(500, "Failed to load menu versions");

		return {
			menu: {
				...menu,
				currentVersion: menuVersion,
				allVersions: versions
			},
			allAllergens: (await supabase.from("allergens").select("*")).data,
			allIngredients: (await supabase.from("ingredients").select("*")).data
		};
	} catch (err) {
		console.error("Unexpected error:", err);
		throw error(500, "An unexpected error occurred");
	}
};