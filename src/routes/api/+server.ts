// src/routes/api/menu/+server.ts
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const menuData = await request.json();

		// Validace
		if (!menuData.date) {
			throw error(400, "Date is required");
		}

		const { data: menu, error: menuError } = await supabase
			.from("menus")
			.insert({
				date: menuData.date,
				soup: menuData.soup,
				active: menuData.active,
				// další pole...
			})
			.select()
			.single();

		if (menuError) {
			console.error("Database error:", menuError);
			throw error(500, "Failed to create menu");
		}

		return json({
			success: true,
			data: menu
		});

	} catch (err) {
		// Pokud je to již SvelteKit error, propagujeme ho dál
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		// Jinak vytvoříme nový error
		console.error("Unexpected error:", err);
		throw error(500, "An unexpected error occurred");
	}
};