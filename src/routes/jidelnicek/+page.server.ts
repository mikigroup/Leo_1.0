import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import type { Menu } from "$lib/types";

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	try {
		// Výpočet datumového rozsahu pro menu
		const now = new Date();
		let startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

		// Pokud je po 17:00, začínáme od následujícího dne
		if (now.getHours() >= 17) {
			startDate.setDate(startDate.getDate() + 1);
		}

		const endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() + 27); // 4 týdny od startDate

		// Paralelní načtení menu a textů
		const [menusResult, textsResult] = await Promise.all([
			supabase
				.from("menus")
				.select(`
          *,
          variants:menu_variants(
            *,
            allergens:variant_allergens(allergen:allergens(*)),
            ingredients:variant_ingredients(ingredient:ingredients(*))
          ),
          allergens:menu_allergens(allergen:allergens(*)),
          ingredients:menu_ingredients(ingredient:ingredients(*))
        `)
				.eq("active", true)
				.eq("deleted", false)
				.gte("date", startDate.toISOString())
				.lte("date", endDate.toISOString())
				.order("date", { ascending: true }),

			supabase
				.from("texts")
				.select("*")
				.eq("page", "jidelnicek")
		]);

		if (menusResult.error) {
			console.error("Error fetching menus:", menusResult.error);
			throw error(500, "Nepodařilo se načíst menu");
		}

		if (textsResult.error) {
			console.error("Error fetching texts:", textsResult.error);
			throw error(500, "Nepodařilo se načíst texty");
		}

		// Zpracování menu dat s použitím existujícího typu Menu
		const processedMenus = menusResult.data.map((menu: any) => ({
			...menu,
			variants: (menu.variants || [])
				.map((variant: any) => ({
					...variant,
					allergens: variant.allergens?.map((a: any) => a.allergen) || [],
					ingredients: variant.ingredients?.map((i: any) => i.ingredient) || []
				}))
				.sort((a: any, b: any) => parseInt(a.variant_number) - parseInt(b.variant_number)),
			allergens: menu.allergens?.map((a: any) => a.allergen) || [],
			ingredients: menu.ingredients?.map((i: any) => i.ingredient) || []
		}));

		// Rozdělení do týdnů s použitím typu Menu[][]
		const weeks: Menu[][] = [[], [], [], []];
		processedMenus.forEach((menu) => {
			if (menu.date) {
				const menuDate = new Date(menu.date);
				const weekIndex = Math.floor(
					(menuDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
				);
				if (weekIndex >= 0 && weekIndex < 4) {
					weeks[weekIndex].push(menu);
				}
			}
		});

		return {
			menus: processedMenus,
			weeks,
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString(),
			text: textsResult.data[0] || null
		};
	} catch (err) {
		console.error("Error in load function:", err);
		throw error(500, "Nastala chyba při načítání dat");
	}
};