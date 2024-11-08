import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

interface MenuVariant {
	id: string;
	variant_number: string;
	description: string;
	price: number | null;
}
interface Menu {
	id: string;
	date: string | null;
	soup: string | null;
	active: boolean | null;
	notes: string | null;
	type: string | null;
	nutri: string | null;
	variants: MenuVariant[];
}
interface Text {
	id: number;
	title: string | null;
	text: string | null;
	page: string | null;
}

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	try {
		// Nastavení fixního data pro test
		const startDate = new Date('2024-11-18');
		const endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() + 27); // 4 týdny od startDate

		// Paralelní načtení menu a textů
		const [menusResult, textsResult] = await Promise.all([
			supabase
				.from("menus")
				.select(`
          id,
          date,
          soup,
          active,
          notes,
          type,
          nutri,
          variants:menu_variants(
            id,
            variant_number,
            description,
            price
          )
        `)
				.eq("active", true)
				.eq("deleted", false)
				.order("date", { ascending: true }),
			supabase
				.from("texts")
				.select("*")
				.eq("page", "jidelnicek")
		]);

		console.log('Menu Result:', menusResult);
		console.log('Texts Result:', textsResult);

		if (menusResult.error) {
			console.error("Error fetching menus:", menusResult.error);
			throw error(500, "Nepodařilo se načíst menu");
		}

		if (textsResult.error) {
			console.error("Error fetching texts:", textsResult.error);
			throw error(500, "Nepodařilo se načíst texty");
		}

		// Zpracování menu
		const processedMenus = menusResult.data.map(menu => ({
			...menu,
			variants: (menu.variants || []).sort((a, b) =>
				parseInt(a.variant_number) - parseInt(b.variant_number)
			)
		})) as Menu[];

		// Rozdělení do týdnů
		const weeks: Menu[][] = [[], [], [], []];
		processedMenus.forEach((menu) => {
			if (menu.date) {
				const menuDate = new Date(menu.date);
				const weekIndex = Math.floor(
					(menuDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
				);

				console.log('Processing menu:', {
					menuId: menu.id,
					date: menu.date,
					weekIndex,
					variantsCount: menu.variants.length
				});

				if (weekIndex >= 0 && weekIndex < 4) {
					weeks[weekIndex].push(menu);
				}
			}
		});

		// Zpracování textů
		const text = textsResult.data.length > 0 ? textsResult.data[0] : null;
		console.log('Processed text:', text);

		return {
			menus: processedMenus,
			weeks,
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString(),
			text // vracíme celý text objekt
		};
	} catch (err) {
		console.error("Error in load function:", err);
		throw error(500, "Nastala chyba při načítání dat");
	}
};