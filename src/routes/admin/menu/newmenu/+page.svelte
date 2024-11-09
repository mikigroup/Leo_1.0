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
			{ id: "", variant_number: "1", description: "", price: 0, allergens: [], ingredients: [] },
			{ id: "", variant_number: "2", description: "", price: 0, allergens: [], ingredients: [] },
			{ id: "", variant_number: "3", description: "", price: 0, allergens: [], ingredients: [] }
		]
	};

	async function createMenu() {
		try {
			loading = true;
			errorMessage = "";
			updateMessage = "";

			console.log('Odesílaná data:', JSON.stringify(newMenu, null, 2));

			// Validace
			if (!newMenu.date) {
				errorMessage = "Datum je povinné";
				return;
			}

			// Vyfiltrujeme prázdné varianty
			const validVariants = newMenu.variants.filter(v =>
				v.description.trim() !== '' || v.price > 0
			);

			// Připravíme data pro odeslání
			const menuData = {
				...newMenu,
				variants: validVariants.map((v, index) => ({
					...v,
					variant_number: (index + 1).toString()
				}))
			};

			const response = await fetch('/api/menu', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(menuData)
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				console.error('Server response:', errorData);
				throw new Error(errorData?.message || 'Failed to create menu');
			}

			const result = await response.json();
			console.log('Server response:', result);

			updateMessage = "Nové menu úspěšně vytvořeno!";
			await goto($ROUTES.ADMIN.MENU.LIST);

		} catch (error) {
			console.error("Error creating menu:", error);
			errorMessage = error instanceof Error ? error.message : "Nastala chyba při vytváření menu";
		} finally {
			loading = false;
		}
	}

	function handleUpdate(event: CustomEvent<Menu>) {
		console.log('Received update:', JSON.stringify(event.detail, null, 2));
		newMenu = event.detail;
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
				on:click={createMenu}
				class="btn btn-outline">
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