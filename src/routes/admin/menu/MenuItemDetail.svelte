<script lang="ts">
	import TagSelector from "./TagSelector.svelte";
	import type { Menu } from "$lib/types/menu";
	import type { Database } from "$lib/database.types";
	import type { TagUpdateEvent } from "$lib/types/tag";
	import { createEventDispatcher } from "svelte";
	import { page } from "$app/stores";
	import { ROUTES } from "$lib/stores/store";

	// Component props
	export let menu: Menu;
	export let allAllergens: Database["public"]["Tables"]["allergens"]["Row"][];
	export let allIngredients: Database["public"]["Tables"]["ingredients"]["Row"][];

	// Create event dispatcher for menu updates
	const dispatch = createEventDispatcher<{ update: Menu }>();

	// Inicializace variant s čísly pokud je nové menu
	$: if ($page.url.pathname === $ROUTES.ADMIN.MENU.NEW && menu.variants) {
		menu.variants = menu.variants.map((variant, index) => ({
			...variant,
			variant_number: (index + 1).toString()
		}));
	}

	// Reactive statement to dispatch update event whenever menu changes
	$: {
		dispatch("update", menu);
		console.log("Dispatching update with menu:", menu);
	}

	// Update allergens for the main menu
	function handleAllergensUpdate(event: CustomEvent<TagUpdateEvent>) {
		console.log("handleAllergensUpdate called with:", event.detail);
		menu = {
			...menu,
			allergens: event.detail.tags
		};
		console.log("menu after allergens update:", menu);
	}

	// Update ingredients for the main menu
	function handleIngredientsUpdate(event: CustomEvent<TagUpdateEvent>) {
		console.log("handleIngredientsUpdate called with:", event.detail);
		menu = {
			...menu,
			ingredients: event.detail.tags
		};
		console.log("menu after ingredients update:", menu);
	}

	// Update allergens for a specific menu variant
	function handleVariantAllergensUpdate(variantIndex: number, event: CustomEvent<TagUpdateEvent>) {
		const updatedVariants = [...menu.variants];
		updatedVariants[variantIndex] = {
			...updatedVariants[variantIndex],
			allergens: event.detail.tags
		};
		menu = {
			...menu,
			variants: updatedVariants
		};
	}

	// Update ingredients for a specific menu variant
	function handleVariantIngredientsUpdate(variantIndex: number, event: CustomEvent<TagUpdateEvent>) {
		const updatedVariants = [...menu.variants];
		updatedVariants[variantIndex] = {
			...updatedVariants[variantIndex],
			ingredients: event.detail.tags
		};
		menu = {
			...menu,
			variants: updatedVariants
		};
	}
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 menuWrap mt-10">
	<div>
		<div class="form-control w-full mb-2">
			<label class="label">
				<span class="label-text">Datum</span>
			</label>
			<input
				type="date"
				class="input input-bordered w-full"
				bind:value={menu.date}
			/>
		</div>

		<div class="form-control w-full mb-2">
			<label class="label">
				<span class="label-text">Aktivní</span>
			</label>
			<select class="select select-bordered w-full boolen" bind:value={menu.active}>
				<option value={false}>NE</option>
				<option value={true}>Ano</option>
			</select>
		</div>

		<div class="form-control w-full mb-2">
			<label class="label">
				<span class="label-text">Alergeny</span>
			</label>
			<TagSelector
				selectedTags={menu.allergens}
				availableTags={allAllergens}
				type="allergen"
				on:update={handleAllergensUpdate}
			/>
		</div>

		<div class="form-control w-full mb-2">
			<label class="label">
				<span class="label-text">Ingredience</span>
			</label>
			<TagSelector
				selectedTags={menu.ingredients}
				availableTags={allIngredients}
				type="ingredient"
				on:update={handleIngredientsUpdate}
			/>
		</div>
	</div>

	<div>
		<div class="form-control w-full mb-2">
			<label class="label">
				<span class="label-text">Polévka</span>
			</label>
			<input
				type="text"
				class="input input-bordered w-full"
				bind:value={menu.soup}
			/>
		</div>

		<div class="form-control w-full mb-2 border rounded-xl mt-5">
			<label class="label">
				<span class="label-text">Hlavní chod</span>
			</label>
			<div class="grid grid-rows-3 gap-2">
				{#each menu.variants as variant, index}
					<div class="variant-container mb-10 border rounded-xl p-5 border-gray-400 bg-neutral-100">
						<div class="rounded-2xl border w-3 px-4 py-1 flex justify-center bg-white mb-2">
							{variant.variant_number}
						</div>
						<textarea
							class="textarea textarea-bordered w-full"
							placeholder={`Menu ${index + 1}`}
							rows="4"
							bind:value={variant.description}
						></textarea>
						<div class="mt-2">
							<label class="label">
								<span class="label-text">Cena varianty</span>
							</label>
							<input
								type="number"
								class="input input-bordered w-full"
								bind:value={variant.price}
							/>
						</div>
						<div class="flex-row flex">
							<div class="mt-2 w-full">
								<label class="label">
									<span class="label-text">Alergeny varianty</span>
								</label>
								<TagSelector
									selectedTags={variant.allergens}
									availableTags={allAllergens}
									type="allergen"
									on:update={(event) => handleVariantAllergensUpdate(index, event)}
								/>
								<div class="mt-2 w-full">
									<label class="label">
										<span class="label-text">Ingredience varianty</span>
									</label>
									<TagSelector
										selectedTags={variant.ingredients}
										availableTags={allIngredients}
										type="ingredient"
										on:update={(event) => handleVariantIngredientsUpdate(index, event)}
									/>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="form-control w-full mb-2">
		<label class="label">
			<span class="label-text">Poznámky</span>
		</label>
		<textarea
			class="textarea textarea-bordered"
			bind:value={menu.notes}
		></textarea>
	</div>
</div>

<div class="mt-4">
	<div class="form-control w-full mb-2">
		<label class="label">
			<span class="label-text">Nutriční info</span>
		</label>
		<input
			type="text"
			class="input input-bordered w-full"
			bind:value={menu.nutri}
		/>
	</div>
	<div class="form-control w-full mb-2">
		<label class="label">
			<span class="label-text">Typ</span>
		</label>
		<input
			type="text"
			class="input input-bordered w-full"
			bind:value={menu.type}
		/>
	</div>
</div>

<style>
    input, textarea, .boolen {
        border: solid 1px;
        border-radius: 15px;
    }
</style>