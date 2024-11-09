// src/routes/admin/menu/[menuId]/+page.server.ts
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const { menuId } = params;

	try {
		// 1. Načteme základní menu data
		const { data: menu, error: menuError } = await supabase
			.from('menus')
			.select(`
                *,
                variants:menu_variants(
                    *,
                    allergens:variant_allergens(allergen:allergens(*)),
                    ingredients:variant_ingredients(ingredient:ingredients(*))
                )
            `)
			.eq('id', menuId)
			.single();

		if (menuError) {
			console.error("Error loading menu:", menuError);
			throw error(404, "Menu not found");
		}

		// 2. Načteme alergeny a ingredience pro selekty
		const [allergensResult, ingredientsResult] = await Promise.all([
			supabase
				.from('allergens')
				.select('*')
				.order('number'),
			supabase
				.from('ingredients')
				.select('*')
				.order('name')
		]);

		if (allergensResult.error) throw allergensResult.error;
		if (ingredientsResult.error) throw ingredientsResult.error;

		return {
			menu,
			allAllergens: allergensResult.data,
			allIngredients: ingredientsResult.data
		};

	} catch (err) {
		console.error("Error in menu edit load:", err);
		throw error(500, "Failed to load menu data");
	}
};