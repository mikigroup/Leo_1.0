// src/routes/api/menu/+server.ts
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		// Log incoming request
		const menuData = await request.json();
		console.log('Received menu data:', JSON.stringify(menuData, null, 2));

		// Validate required fields
		if (!menuData.date) {
			throw error(400, "Date is required");
		}

		// 1. Create menu
		console.log('Creating menu with data:', {
			date: menuData.date,
			soup: menuData.soup,
			active: menuData.active,
			notes: menuData.notes,
			type: menuData.type,
			nutri: menuData.nutri
		});

		const { data: menu, error: menuError } = await supabase
			.from("menus")
			.insert({
				date: menuData.date,
				soup: menuData.soup,
				active: menuData.active,
				notes: menuData.notes,
				type: menuData.type,
				nutri: menuData.nutri,
				deleted: false
			})
			.select()
			.single();

		if (menuError) {
			console.error("Database error during menu creation:", menuError);
			throw error(500, "Failed to create menu");
		}

		console.log('Menu created:', menu);

		// 2. Create variants if they exist
		if (menuData.variants?.length) {
			console.log('Processing variants:', menuData.variants);

			for (const variant of menuData.variants) {
				try {
					// Create variant
					console.log('Creating variant:', variant);

					const { data: newVariant, error: variantError } = await supabase
						.from("menu_variants")
						.insert({
							menu_id: menu.id,
							variant_number: variant.variant_number,
							description: variant.description,
							price: variant.price
						})
						.select()
						.single();

					if (variantError) {
						console.error("Error creating variant:", variantError);
						throw error(500, `Failed to create variant: ${variantError.message}`);
					}

					console.log('Variant created:', newVariant);

					// Add allergens if they exist
					if (variant.allergens?.length) {
						console.log('Adding allergens for variant:', variant.allergens);

						const { error: allergensError } = await supabase
							.from("variant_allergens")
							.insert(
								variant.allergens.map((a : { id: number }) => ({
									variant_id: newVariant.id,
									allergen_id: a.id
								}))
							);

						if (allergensError) {
							console.error("Error adding allergens:", allergensError);
							throw error(500, `Failed to add allergens: ${allergensError.message}`);
						}
					}

					// Add ingredients if they exist
					if (variant.ingredients?.length) {
						console.log('Adding ingredients for variant:', variant.ingredients);

						const { error: ingredientsError } = await supabase
							.from("variant_ingredients")
							.insert(
								variant.ingredients.map((i: { id: number }) => ({
									variant_id: newVariant.id,
									ingredient_id: i.id
								}))
							);

						if (ingredientsError) {
							console.error("Error adding ingredients:", ingredientsError);
							throw error(500, `Failed to add ingredients: ${ingredientsError.message}`);
						}
					}

				} catch (variantError) {
					console.error("Error processing variant:", variantError);
					throw error(500, variantError instanceof Error ? variantError.message : "Error processing variant");
				}
			}
		}

		return json({
			success: true,
			data: menu
		});

	} catch (err) {
		console.error("Error creating menu:", err);
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		throw error(500, err instanceof Error ? err.message : "An unexpected error occurred");
	}
};