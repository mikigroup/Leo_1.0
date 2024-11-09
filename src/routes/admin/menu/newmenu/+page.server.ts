// src/routes/admin/menu/newmenu/+page.server.ts
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	try {
		const [allergensResult, ingredientsResult] = await Promise.all([
			supabase
				.from("allergens")
				.select("*")
				.order("number"),

			supabase
				.from("ingredients")
				.select("*")
				.order("name")
		]);

		if (allergensResult.error) {
			console.error("Error loading allergens:", allergensResult.error);
			throw error(500, "Failed to load allergens");
		}

		if (ingredientsResult.error) {
			console.error("Error loading ingredients:", ingredientsResult.error);
			throw error(500, "Failed to load ingredients");
		}

		return {
			allAllergens: allergensResult.data,
			allIngredients: ingredientsResult.data
		};

	} catch (err) {
		console.error("Error loading menu data:", err);
		throw error(500, "An unexpected error occurred");
	}
};