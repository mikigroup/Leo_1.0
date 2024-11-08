<script lang="ts">
	import { goto } from "$app/navigation";
	import { fade, fly } from "svelte/transition";
	import MenuItemDetail from "../MenuItemDetail.svelte";
	import VersionTimeline from "./VersionTimeline.svelte";
	import type { Menu } from "$lib/types";
	import { ROUTES } from "$lib/stores/store";

	export let data;
	let { menu, allAllergens, allIngredients } = data;

	let selectedVersion = menu.currentVersion;
	let showVersionHistory = false;

	// Funkce pro přepnutí verze
	async function switchVersion(version: any) {
		const searchParams = new URLSearchParams(window.location.search);
		searchParams.set('date', version.valid_from);
		await goto(`?${searchParams.toString()}`);
	}

	// Upravená funkce pro update
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

				// Aktualizace alergenů varianty
				await supabase
					.from("variant_allergens")
					.delete()
					.eq("variant_id", variant.id);
				for (const allergen of variant.allergens) {
					await supabase.from("variant_allergens").insert({
						variant_id: variant.id,
						allergen_id: allergen.id
					});
				}

				// Aktualizace ingrediencí varianty
				await supabase
					.from("variant_ingredients")
					.delete()
					.eq("variant_id", variant.id);
				for (const ingredient of variant.ingredients) {
					await supabase.from("variant_ingredients").insert({
						variant_id: variant.id,
						ingredient_id: ingredient.id
					});
				}
			}

		updateMessage = "Menu bylo upraveno a vytvořena nová verze!";
		await goto($ROUTES.ADMIN.MENU.LIST);
	} catch (error) {
		console.error("Chyba při aktualizaci menu:", error);
		errorMessage = "Chyba při úpravě menu";
	} finally {
		loading = false;
	}
	}

	async function softDeleteMenu() {
		try {
			loading = true;

			const { data, error } = await supabase.rpc("soft_delete_menu", {
				p_menu_id: menu.id
			});

			if (error) throw error;

			updateMessage = "Menu bylo úspěšně označeno jako smazané";
			await goto($ROUTES.ADMIN.MENU.LIST, { replaceState: true });
		} catch (error) {
			console.error("Error soft-deleting menu:", error);
			errorMessage = "Chyba při označování menu jako smazané";
		} finally {
			loading = false;
		}
	}

	async function back() {
		await goto($ROUTES.ADMIN.MENU.LIST);
	}

	function handleUpdate(event: CustomEvent<Menu>) {
		console.log("handleUpdate called with:", event.detail);
		menu = event.detail;
		console.log("newMenu after update:", menu);
	}
</script>

<div class="relative p-5 overflow-x-auto shadow-md sm:rounded-lg border border-zinc-200"
		 in:fly={{ y: 50, duration: 500 }}>

	<!-- Základní ovládací prvky -->
	<div class="flex justify-between items-center mb-4">
		<button on:click={back} class="btn btn-outline">Zpět</button>

		<!-- Přidán přepínač historie -->
		<button
			class="btn btn-outline"
			on:click={() => showVersionHistory = !showVersionHistory}>
			{showVersionHistory ? 'Skrýt historii' : 'Zobrazit historii'}
		</button>

		<div class="flex flex-col gap-2 md:flex-row">
			<button disabled={loading} on:click={updateMenu} class="btn btn-outline">
				{loading ? "Ukládá se..." : "Uložit jako novou verzi"}
			</button>
			<button class="btn btn-outline btn-error"
							disabled={loading}
							on:click={softDeleteMenu}>
				{loading ? "Maže se..." : "Smazat menu"}
			</button>
		</div>
	</div>

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
			{menu.currentVersion ?
				`Úprava menu - verze z ${new Date(menu.currentVersion.valid_from).toLocaleDateString()}` :
				'Úprava menu'}
		</h2>
		<MenuItemDetail
			bind:menu
			{allAllergens}
			{allIngredients}
			on:update={handleUpdate}
		/>
	</div>
</div>

<style>
</style>
