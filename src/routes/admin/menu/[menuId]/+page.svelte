<script lang="ts">
	import { goto } from "$app/navigation";
	import { fade, fly } from "svelte/transition";
	import MenuItemDetail from "../MenuItemDetail.svelte";
	import VersionTimeline from "./VersionTimeline.svelte";
	import type { Menu } from "$lib/types";
	import { ROUTES } from "$lib/stores/store";

	// Typy pro verze
	interface MenuVersion {
		id: string;
		menu_id: string;
		valid_from: string;
		valid_to: string | null;
		soup: string | null;
		active: boolean;
		notes: string | null;
		type: string | null;
		nutri: string | null;
	}

	// Props a reaktivní proměnné
	export let data;
	let { menu, allAllergens, allIngredients, session, supabase } = data;
	$: ({ menu, allAllergens, allIngredients, session, supabase } = data);

	let loading = false;
	let updateMessage = '';
	let errorMessage = '';
	let selectedVersion = menu?.currentVersion || null;
	let showVersionHistory = false;

	// Přepnutí verze
	async function switchVersion(version: MenuVersion) {
		try {
			const searchParams = new URLSearchParams(window.location.search);
			searchParams.set('date', version.valid_from);
			await goto(`?${searchParams.toString()}`);
		} catch (error) {
			console.error("Chyba při přepínání verze:", error);
			errorMessage = "Nepodařilo se přepnout verzi";
		}
	}

	// Aktualizace menu a vytvoření nové verze
	async function updateMenu() {
		try {
			loading = true;
			errorMessage = "";
			updateMessage = "";

			// Vytvoření nové verze menu
			const { data: newVersion, error: versionError } = await supabase
				.rpc('create_menu_version', {
					p_menu_id: menu.id,
					p_date: menu.date,
					p_soup: menu.soup,
					p_active: menu.active,
					p_notes: menu.notes,
					p_type: menu.type,
					p_nutri: menu.nutri
				});

			if (versionError) throw versionError;

			// Aktualizace variant
			for (const variant of menu.variants) {
				// Aktualizace základních údajů varianty
				const { error: variantError } = await supabase
					.from("menu_variants")
					.upsert({
						menu_id: menu.id,
						menu_version_id: newVersion.id,
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

				const allergenPromises = variant.allergens.map(allergen =>
					supabase.from("variant_allergens").insert({
						variant_id: variant.id,
						allergen_id: allergen.id
					})
				);
				await Promise.all(allergenPromises);

				// Aktualizace ingrediencí
				await supabase
					.from("variant_ingredients")
					.delete()
					.eq("variant_id", variant.id);

				const ingredientPromises = variant.ingredients.map(ingredient =>
					supabase.from("variant_ingredients").insert({
						variant_id: variant.id,
						ingredient_id: ingredient.id
					})
				);
				await Promise.all(ingredientPromises);
			}

			updateMessage = "Menu bylo upraveno";
			// await goto($ROUTES.ADMIN.MENU.LIST);
		} catch (error) {
			console.error("Chyba při aktualizaci menu:", error);
			errorMessage = "Chyba při úpravě menu";
		} finally {
			loading = false;
		}
	}

	// Soft delete menu
	async function softDeleteMenu() {
		try {
			loading = true;
			errorMessage = "";

			const { error } = await supabase.rpc("soft_delete_menu", {
				p_menu_id: menu.id
			});

			if (error) throw error;

			updateMessage = "Menu bylo úspěšně označeno jako smazané";
			await goto($ROUTES.ADMIN.MENU.LIST, { replaceState: true });
		} catch (error) {
			console.error("Chyba při mazání menu:", error);
			errorMessage = "Chyba při označování menu jako smazané";
		} finally {
			loading = false;
		}
	}

	// Návrat na seznam
	async function back() {
		await goto($ROUTES.ADMIN.MENU.LIST);
	}

	// Handler pro aktualizaci menu z detail komponenty
	function handleUpdate(event: CustomEvent<Menu>) {
		menu = event.detail;
	}
</script>

<div class="relative p-5 overflow-x-auto shadow-md sm:rounded-lg border border-zinc-200"
		 in:fly={{ y: 50, duration: 500 }}>

	<!-- Základní ovládací prvky -->
	<div class="flex justify-between items-center mb-4">
		<button on:click={back} class="btn btn-outline">
			Zpět
		</button>

		<button
			class="btn btn-outline"
			on:click={() => showVersionHistory = !showVersionHistory}>
			{showVersionHistory ? 'Skrýt historii' : 'Zobrazit historii'}
		</button>

		<div class="flex flex-col gap-2 md:flex-row">
			<button
				disabled={loading}
				on:click={updateMenu}
				class="btn btn-outline">
				{loading ? "Ukládá se..." : "Uložit"}
			</button>
			<button
				class="btn btn-outline btn-error"
				disabled={loading}
				on:click={softDeleteMenu}>
				{loading ? "Maže se..." : "Smazat menu"}
			</button>
		</div>
	</div>

	<!-- Zprávy -->
	{#if updateMessage}
		<div transition:fade class="alert alert-success mt-4">
			{updateMessage}
		</div>
	{/if}
	{#if errorMessage}
		<div transition:fade class="alert alert-error mt-4">
			{errorMessage}
		</div>
	{/if}

	<!-- Timeline s verzemi -->
	{#if showVersionHistory}
		<div class="mb-6" transition:fade>
			<VersionTimeline
				versions={menu.allVersions}
				selectedVersion={menu.currentVersion}
				on:select={(e) => switchVersion(e.detail)}
			/>
		</div>
	{/if}

	<!-- Formulář pro editaci -->
	<div class="rounded-xl p-4 md:p-10 bg-neutral-200">
		<h2 class="text-2xl font-bold mb-6">
				Úprava menu
		</h2>
		<MenuItemDetail
			bind:menu
			{allAllergens}
			{allIngredients}
			on:update={handleUpdate}
		/>
	</div>
</div>