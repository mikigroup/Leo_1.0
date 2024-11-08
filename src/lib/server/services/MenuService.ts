import { error } from "@sveltejs/kit";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "$lib/database.types";

type DbAllergen = Database['public']['Tables']['allergens']['Row'];
type DbIngredient = Database['public']['Tables']['ingredients']['Row'];

export class MenuService {
	constructor(private supabase: SupabaseClient) {}

	async getAllergens(): Promise<DbAllergen[]> {
		const { data, error: allergensError } = await this.supabase
			.from("allergens")
			.select("*")
			.order("number");

		if (allergensError) {
			console.error("Error fetching allergens:", allergensError);
			throw error(500, "Failed to load allergens");
		}

		return data;
	}

	async getIngredients(): Promise<DbIngredient[]> {
		const { data, error: ingredientsError } = await this.supabase
			.from("ingredients")
			.select("*")
			.order("name");

		if (ingredientsError) {
			console.error("Error fetching ingredients:", ingredientsError);
			throw error(500, "Failed to load ingredients");
		}

		return data;
	}

	async getNewMenuData() {
		try {
			const [allergens, ingredients] = await Promise.all([
				this.getAllergens(),
				this.getIngredients()
			]);

			return {
				allAllergens: allergens,
				allIngredients: ingredients
			};
		} catch (err) {
			console.error("Error loading menu data:", err);
			throw error(500, "Failed to load menu data");
		}
	}
}