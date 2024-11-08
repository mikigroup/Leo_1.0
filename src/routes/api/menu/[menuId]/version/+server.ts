import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';

export const POST: RequestHandler = async ({ params, request, locals: { supabase } }) => {
	const { menuId } = params;
	const { date, soup, active, notes, type, nutri } = await request.json();

	try {
		// Začátek transakce
		const { data: menu, error: menuError } = await supabase
			.from('menus')
			.select('*')
			.eq('id', menuId)
			.single();

		if (menuError) throw menuError;

		// 1. Načteme aktuální varianty menu
		const { data: currentVariants, error: variantsError } = await supabase
			.from('menu_variants')
			.select(`
                id,
                variant_number,
                description,
                price,
                allergens:variant_allergens(allergen_id),
                ingredients:variant_ingredients(ingredient_id)
            `)
			.eq('menu_id', menuId);

		if (variantsError) throw variantsError;

		// 2. Vytvoříme novou verzi menu
		const { data: newVersion, error: versionError } = await supabase
			.from('menu_versions')
			.insert({
				menu_id: menuId,
				date,
				soup,
				active,
				notes,
				type,
				nutri,
				valid_from: new Date().toISOString(),
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			})
			.select()
			.single();

		if (versionError) throw versionError;

		// 3. Pro každou variantu vytvoříme kopii pro novou verzi
		for (const variant of currentVariants) {
			// Kopírujeme variantu
			const { data: newVariant, error: variantError } = await supabase
				.from('menu_variants')
				.insert({
					menu_id: menuId,
					menu_version_id: newVersion.id,
					variant_number: variant.variant_number,
					description: variant.description,
					price: variant.price
				})
				.select()
				.single();

			if (variantError) throw variantError;

			// Kopírujeme alergeny
			if (variant.allergens?.length) {
				const allergenInserts = variant.allergens.map(a => ({
					variant_id: newVariant.id,
					allergen_id: a.allergen_id
				}));

				const { error: allergenError } = await supabase
					.from('variant_allergens')
					.insert(allergenInserts);

				if (allergenError) throw allergenError;
			}

			// Kopírujeme ingredience
			if (variant.ingredients?.length) {
				const ingredientInserts = variant.ingredients.map(i => ({
					variant_id: newVariant.id,
					ingredient_id: i.ingredient_id
				}));

				const { error: ingredientError } = await supabase
					.from('variant_ingredients')
					.insert(ingredientInserts);

				if (ingredientError) throw ingredientError;
			}
		}

		// 4. Ukončíme platnost předchozí verze
		const { error: updateError } = await supabase
			.from('menu_versions')
			.update({ valid_to: new Date().toISOString() })
			.eq('menu_id', menuId)
			.is('valid_to', null)
			.neq('id', newVersion.id);

		if (updateError) throw updateError;

		return json({
			success: true,
			version: newVersion
		});

	} catch (err) {
		console.error('Error creating menu version:', err);
		throw error(500, 'Chyba při vytváření verze menu');
	}
};