<script lang="ts">
	import { goto } from "$app/navigation";
	import { fade, fly } from "svelte/transition";
	import MenuItemDetail from "../MenuItemDetail.svelte";
	import type { PageData } from "./$types";
	import type { Menu } from "$lib/types/menu";
	import { ROUTES } from "$lib/stores/store";

	export let data: PageData;
	let { allAllergens, allIngredients } = data;

	let loading = false;
	let updateMessage = "";
	let errorMessage = "";

	// Initialize new menu object with default values
	let newMenu: Menu = {
		id: "",
		date: "",
		soup: "",
		active: false,
		notes: "",
		type: "",
		nutri: "",
		allergens: [],
		ingredients: [],
		variants: [
			{ id: "", description: "", price: 0, allergens: [], ingredients: [] },
			{ id: "", description: "", price: 0, allergens: [], ingredients: [] },
			{ id: "", description: "", price: 0, allergens: [], ingredients: [] }
		]
	};

	async function createMenu() {
		try {
			loading = true;
			errorMessage = "";
			updateMessage = "";

			if (!newMenu.date) {
				errorMessage = "Datum je povinné";
				return;
			}

			const response = await fetch('/api/menu', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newMenu)
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to create menu');
			}

			const result = await response.json();
			updateMessage = "Nové menu úspěšně vytvořeno!";
			await goto($ROUTES.ADMIN.MENU.LIST, { replaceState: true });
		} catch (error) {
			console.error("Error creating menu:", error);
			errorMessage = error instanceof Error ? error.message : "Nastala chyba při vytváření menu";
		} finally {
			loading = false;
		}
	}

	async function back() {
		await goto($ROUTES.ADMIN.MENU.LIST);
	}

	function handleUpdate(event: CustomEvent<Menu>) {
		newMenu = event.detail;
	}
</script>


<div
	class="relative p-5 overflow-x-auto shadow-md sm:rounded-lg border border-zinc-200"
	in:fly={{ y: 50, duration: 500 }}>
	<div class="flex justify-between items-center mb-4">
		<button on:click={back} class="btn btn-outline">Zpět</button>
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
			<button disabled={loading} on:click={createMenu} class="btn btn-outline">
				{loading ? "Vytváří se..." : "Vytvořit menu"}
			</button>
		</div>
	</div>

	<div class="divider"></div>

	<div class="rounded-xl p-4 md:p-10 bg-neutral-200">
		<h2 class="text-2xl font-bold mb-6">Nové menu</h2>
		<MenuItemDetail
			bind:menu={newMenu}
			{allAllergens}
			{allIngredients}
			on:update={handleUpdate} />
	</div>
</div>

<style>
</style>
