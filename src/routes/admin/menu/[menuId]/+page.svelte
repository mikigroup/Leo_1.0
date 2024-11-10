<script lang="ts">
	import { goto } from "$app/navigation";
	import { fade, fly } from "svelte/transition";
	import MenuItemDetail from "../MenuItemDetail.svelte";
	import type { PageData } from "./$types";
	import type { Menu } from "$lib/types/menu";
	import { ROUTES } from "$lib/stores/store";

	export let data: PageData;
	let { menu, allAllergens, allIngredients, supabase } = data;
	$: ({ menu, allAllergens, allIngredients, supabase } = data);

	let loading = false;
	let updateMessage = "";
	let errorMessage = "";

	async function updateMenu() {
		try {
			loading = true;
			errorMessage = "";
			updateMessage = "";

			console.log('Odesílaná data:', JSON.stringify(menu, null, 2));

			// Validace
			if (!menu.date) {
				errorMessage = "Datum je povinné";
				return;
			}

			// Vyfiltrujeme prázdné varianty
			const validVariants = menu.variants.filter(v =>
				v.description.trim() !== '' || v.price > 0
			);

			// Připravíme data pro odeslání
			const menuData = {
				...menu,
				variants: validVariants.map((v, index) => ({
					...v,
					variant_number: (index + 1).toString()
				}))
			};

			// Aktualizace hlavního menu
			const { error: menuError } = await supabase
				.from("menus")
				.update({
					date: menuData.date,
					soup: menuData.soup,
					active: menuData.active,
					notes: menuData.notes,
					type: menuData.type,
					nutri: menuData.nutri
				})
				.eq("id", menu.id);

			if (menuError) throw menuError;

			// Aktualizace variant
			for (const variant of menuData.variants) {
				const { error: variantError } = await supabase
					.from("menu_variants")
					.upsert({
						menu_id: menu.id,
						id: variant.id,
						variant_number: variant.variant_number,
						description: variant.description,
						price: variant.price
					});

				if (variantError) throw variantError;

				// Aktualizace alergenů
				await supabase
					.from("variant_allergens")
					.delete()
					.eq("variant_id", variant.id);

				if (variant.allergens?.length) {
					await supabase
						.from("variant_allergens")
						.insert(
							variant.allergens.map(allergen => ({
								variant_id: variant.id,
								allergen_id: allergen.id
							}))
						);
				}

				// Aktualizace ingrediencí
				await supabase
					.from("variant_ingredients")
					.delete()
					.eq("variant_id", variant.id);

				if (variant.ingredients?.length) {
					await supabase
						.from("variant_ingredients")
						.insert(
							variant.ingredients.map(ingredient => ({
								variant_id: variant.id,
								ingredient_id: ingredient.id
							}))
						);
				}
			}

			updateMessage = "Menu úspěšně aktualizováno!";
		} catch (error) {
			console.error("Error updating menu:", error);
			errorMessage = error instanceof Error ? error.message : "Nastala chyba při aktualizaci menu";
		} finally {
			loading = false;
		}
	}

	async function softDeleteMenu() {
		try {
			loading = true;
			const { error } = await supabase.rpc("soft_delete_menu", {
				p_menu_id: menu.id
			});

			if (error) throw error;

			await goto($ROUTES.ADMIN.MENU.LIST, { replaceState: true });
		} catch (error) {
			console.error("Error deleting menu:", error);
			errorMessage = "Chyba při mazání menu";
		} finally {
			loading = false;
		}
	}

	function handleUpdate(event: CustomEvent<Menu>) {
		console.log('Received update:', JSON.stringify(event.detail, null, 2));
		menu = event.detail;
	}
</script>

<div class="relative p-5 overflow-x-auto shadow-md sm:rounded-lg border border-zinc-200"
		 in:fly={{ y: 50, duration: 500 }}>
	<div class="flex justify-between items-center mb-4">
		<button
			on:click={() => goto($ROUTES.ADMIN.MENU.LIST)}
			class="btn btn-outline">
			Zpět
		</button>

		{#if updateMessage}
			<div transition:fade class="bg-green-200 text-green-800 rounded p-2">
				<span>{updateMessage}</span>
			</div>
		{/if}

		{#if errorMessage}
			<div transition:fade class="bg-red-200 text-red-800 rounded p-2">
				<span>{errorMessage}</span>
			</div>
		{/if}

		<div class="flex gap-2">
			<button
				disabled={loading}
				on:click={updateMenu}
				class="btn btn-outline">
				{loading ? "Ukládá se..." : "Uložit změny"}
			</button>
			<button
				class="btn btn-outline btn-error"
				disabled={loading}
				on:click={softDeleteMenu}>
				{loading ? "Maže se..." : "Smazat menu"}
			</button>
		</div>
	</div>

	<div class="divider"></div>

	<div class="rounded-xl p-4 md:p-10 bg-neutral-200">
		<h2 class="text-2xl font-bold mb-6">Upravit Menu</h2>
		<MenuItemDetail
			bind:menu
			{allAllergens}
			{allIngredients}
			on:update={handleUpdate}
		/>
	</div>
</div>