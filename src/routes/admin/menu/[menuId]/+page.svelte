// src/routes/admin/menu/[menuId]/+page.svelte
<script lang="ts">
	import { goto } from "$app/navigation";
	import { fade, fly } from "svelte/transition";
	import MenuItemDetail from "../MenuItemDetail.svelte";
	import VersionTimeline from "./VersionTimeline.svelte";
	import type { Menu, MenuVersion } from "$lib/types/menu";
	import { compareVersions, formatVersionDate } from "$lib/utils/menuVersioning";
	import { ROUTES } from "$lib/stores/store";

	export let data;
	let { menu, allAllergens, allIngredients, supabase } = data;
	$: ({ menu, allAllergens, allIngredients, supabase } = data);

	let loading = false;
	let updateMessage = "";
	let errorMessage = "";
	let showVersionHistory = false;

	async function validateVersion(version: MenuVersion) {
		const { data: overlapping, error } = await supabase
			.from('menu_versions')
			.select('*')
			.eq('menu_id', version.menu_id)
			.overlaps('valid_from', version.valid_from);

		if (error) throw new Error(`Validation error: ${error.message}`);
		if (overlapping?.length) throw new Error('Překrývající se verze');
	}

	async function updateMenu() {
		try {
			loading = true;
			errorMessage = "";
			updateMessage = "";

			const newVersion: Partial<MenuVersion> = {
				menu_id: menu.id,
				date: menu.date,
				soup: menu.soup,
				active: menu.active,
				notes: menu.notes,
				type: menu.type,
				nutri: menu.nutri,
				valid_from: new Date().toISOString()
			};

			// Validate new version
			await validateVersion(newVersion as MenuVersion);

			// Create new version
			const { data: createdVersion, error: versionError } = await supabase
				.rpc('create_menu_version', newVersion);

			if (versionError) throw versionError;

			// Update variants
			for (const variant of menu.variants) {
				const { error: variantError } = await supabase
					.from("menu_variants")
					.upsert({
						menu_id: menu.id,
						menu_version_id: createdVersion.id,
						id: variant.id,
						variant_number: variant.variant_number,
						description: variant.description,
						price: variant.price
					});

				if (variantError) throw variantError;

				// Update allergens
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

				// Update ingredients
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

			// Compare with previous version if exists
			if (menu.currentVersion) {
				const changes = compareVersions(menu.currentVersion, createdVersion);
				console.log('Version changes:', changes);
			}

			updateMessage = "Menu bylo úspěšně aktualizováno";
			await goto($ROUTES.ADMIN.MENU.LIST);

		} catch (error) {
			console.error("Error updating menu:", error);
			errorMessage = error instanceof Error ? error.message : "Nastala chyba při aktualizaci menu";
		} finally {
			loading = false;
		}
	}

	async function switchVersion(version: MenuVersion) {
		try {
			const searchParams = new URLSearchParams(window.location.search);
			searchParams.set('date', version.valid_from);
			await goto(`?${searchParams.toString()}`);
		} catch (error) {
			console.error("Error switching version:", error);
			errorMessage = "Nepodařilo se přepnout verzi";
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
		menu = event.detail;
	}
</script>

<div class="relative p-5 overflow-x-auto shadow-md sm:rounded-lg border border-zinc-200"
		 in:fly={{ y: 50, duration: 500 }}>

	<div class="flex justify-between items-center mb-4">
		<button on:click={() => goto($ROUTES.ADMIN.MENU.LIST)}
						class="btn btn-outline">
			Zpět
		</button>

		<button class="btn btn-outline"
						on:click={() => showVersionHistory = !showVersionHistory}>
			{showVersionHistory ? 'Skrýt historii' : 'Zobrazit historii'}
		</button>

		<div class="flex flex-col gap-2 md:flex-row">
			<button disabled={loading}
							on:click={updateMenu}
							class="btn btn-outline">
				{loading ? "Ukládá se..." : "Vytvořit verzi"}
			</button>
			<button class="btn btn-outline btn-error"
							disabled={loading}
							on:click={softDeleteMenu}>
				{loading ? "Maže se..." : "Smazat menu"}
			</button>
		</div>
	</div>

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

	{#if showVersionHistory && menu.allVersions}
		<div class="mb-6" transition:fade>
			<VersionTimeline
				versions={menu.allVersions}
				selectedVersion={menu.currentVersion}
				{formatVersionDate}
				on:select={e => switchVersion(e.detail)}
			/>
		</div>
	{/if}

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