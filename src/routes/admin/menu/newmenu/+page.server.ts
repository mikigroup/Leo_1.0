import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { MenuService } from "$lib/server/services/MenuService";

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const menuData = await request.json();
		const menuService = new MenuService(supabase);
		const newMenu = await menuService.createMenu(menuData);

		return json({
			success: true,
			data: newMenu
		});
	} catch (err) {
		console.error("Error creating menu:", err);
		throw error(500, {
			message: "Failed to create menu",
			details: err instanceof Error ? err.message : "Unknown error"
		});
	}
};
