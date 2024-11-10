<script lang="ts">
	import TagSelector from "./TagSelector.svelte";
	import type { Menu } from "$lib/types/menu";
	import type { Database } from "$lib/database.types";
	import type { TagUpdateEvent } from "$lib/types/tag";
	import { createEventDispatcher } from "svelte";
	import { page } from "$app/stores";
	import { ROUTES } from "$lib/stores/store";

	export let menu: Menu;
	export let allAllergens: Database["public"]["Tables"]["allergens"]["Row"][];
	export let allIngredients: Database["public"]["Tables"]["ingredients"]["Row"][];

	const dispatch = createEventDispatcher<{ update: Menu }>();
	let activeTab = 'basic';

	$: if ($page.url.pathname === $ROUTES.ADMIN.MENU.NEW && menu.variants) {
		menu.variants = menu.variants.map((variant, index) => ({
			...variant,
			variant_number: (index + 1).toString()
		}));
	}

	$: {
		dispatch("update", menu);
	}

	function handleAllergensUpdate(event: CustomEvent<TagUpdateEvent>) {
		menu = { ...menu, allergens: event.detail.tags };
	}

	function handleIngredientsUpdate(event: CustomEvent<TagUpdateEvent>) {
		menu = { ...menu, ingredients: event.detail.tags };
	}

	function handleVariantAllergensUpdate(variantIndex: number, event: CustomEvent<TagUpdateEvent>) {
		const updatedVariants = [...menu.variants];
		updatedVariants[variantIndex] = {
			...updatedVariants[variantIndex],
			allergens: event.detail.tags
		};
		menu = { ...menu, variants: updatedVariants };
	}

	function handleVariantIngredientsUpdate(variantIndex: number, event: CustomEvent<TagUpdateEvent>) {
		const updatedVariants = [...menu.variants];
		updatedVariants[variantIndex] = {
			...updatedVariants[variantIndex],
			ingredients: event.detail.tags
		};
		menu = { ...menu, variants: updatedVariants };
	}

	function handleTabChange(event: Event) {
		const target = event.target as HTMLInputElement;
		activeTab = target.value;
	}
</script>

<div class="container mx-auto">
	<div role="tablist" class="tabs tabs-lifted">
		<input
			type="radio"
			name="menu_tabs"
			role="tab"
			class="tab"
			value="basic"
			checked={activeTab === 'basic'}
			aria-label="Základní info"
			on:change={handleTabChange}
		/>
		<div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
			<!-- Basic Info Content -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
					<div class="card-body">
						<h3 class="card-title mb-4">Základní údaje</h3>
						<div class="grid grid-cols-2 gap-4">
							<div class="form-control w-full">
								<label class="label font-medium">Datum</label>
								<input
									type="date"
									class="input input-bordered focus:outline-none focus:border-primary"
									bind:value={menu.date}
								/>
							</div>
							<div class="form-control w-full">
								<label class="label font-medium">Stav</label>
								<select
									class="select select-bordered focus:outline-none focus:border-primary"
									bind:value={menu.active}
								>
									<option value={false}>Neaktivní</option>
									<option value={true}>Aktivní</option>
								</select>
							</div>
						</div>
					</div>
				</div>

				<div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
					<div class="card-body">
						<h3 class="card-title mb-4">Polévka</h3>
						<div class="form-control w-full">
							<input
								type="text"
								placeholder="Zadejte název polévky"
								class="input input-bordered mb-4 focus:outline-none focus:border-primary"
								bind:value={menu.soup}
							/>
							<TagSelector
								selectedTags={menu.allergens}
								availableTags={allAllergens}
								type="allergen"
								on:update={handleAllergensUpdate}
							/>
							<div class="divider my-4">Ingredience</div>
							<TagSelector
								selectedTags={menu.ingredients}
								availableTags={allIngredients}
								type="ingredient"
								on:update={handleIngredientsUpdate}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>

		<input
			type="radio"
			name="menu_tabs"
			role="tab"
			class="tab"
			value="variants"
			checked={activeTab === 'variants'}
			aria-label="Varianty menu"
			on:change={handleTabChange}
		/>
		<div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
			<!-- Variants Content -->
			<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
				{#each menu.variants as variant, index}
					<div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
						<div class="card-body">
							<div class="flex justify-between items-center mb-4">
								<div class="badge badge-lg badge-primary">{variant.variant_number}</div>
								<div class="text-sm text-gray-500">Varianta {index + 1} ze {menu.variants.length}</div>
							</div>

							<div class="form-control w-full gap-4">
								<div>
									<label class="label font-medium">Popis</label>
									<textarea
										class="textarea textarea-bordered w-full h-24 focus:outline-none focus:border-primary"
										placeholder="Popis varianty"
										bind:value={variant.description}
									/>
								</div>

								<div>
									<label class="label font-medium">Cena (Kč)</label>
									<input
										type="number"
										class="input input-bordered w-full focus:outline-none focus:border-primary"
										bind:value={variant.price}
									/>
								</div>

								<div>
									<label class="label font-medium">Alergeny</label>
									<TagSelector
										selectedTags={variant.allergens}
										availableTags={allAllergens}
										type="allergen"
										on:update={(e) => handleVariantAllergensUpdate(index, e)}
									/>
								</div>

								<div>
									<label class="label font-medium">Ingredience</label>
									<TagSelector
										selectedTags={variant.ingredients}
										availableTags={allIngredients}
										type="ingredient"
										on:update={(e) => handleVariantIngredientsUpdate(index, e)}
									/>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<input
			type="radio"
			name="menu_tabs"
			role="tab"
			class="tab"
			value="additional"
			checked={activeTab === 'additional'}
			aria-label="Další informace"
			on:change={handleTabChange}
		/>
		<div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
			<!-- Additional Info Content -->
			<div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
				<div class="card-body">
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div class="form-control w-full">
							<label class="label font-medium">Nutriční informace</label>
							<input
								type="text"
								class="input input-bordered focus:outline-none focus:border-primary"
								placeholder="Nutriční hodnoty"
								bind:value={menu.nutri}
							/>
						</div>

						<div class="form-control w-full">
							<label class="label font-medium">Typ jídla</label>
							<input
								type="text"
								class="input input-bordered focus:outline-none focus:border-primary"
								placeholder="Typ jídla"
								bind:value={menu.type}
							/>
						</div>

						<div class="form-control w-full lg:col-span-2">
							<label class="label font-medium">Poznámky</label>
							<textarea
								class="textarea textarea-bordered h-32 focus:outline-none focus:border-primary"
								placeholder="Další poznámky k menu"
								bind:value={menu.notes}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>