<script lang="ts">
	import { CartItemsStore } from "$lib/stores/store";
	import { page } from "$app/stores";
	import type { Menu, CartItem } from "$lib/types";

	export let menu: Menu;  // Použijeme náš globální typ Menu

	console.log("Menu",menu)

	function formatDate(dateString: string | null): string {
		if (!dateString) return "Datum není k dispozici";

		const date = new Date(dateString);
		return date.toLocaleDateString("cs-CZ", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric"
		});
	}

	function addToCart(variant: Menu['variants'][0]) {  // Použijeme typ varianty z Menu
		if ($page.data.session) {
			const cartItem: CartItem = {  // Použijeme náš globální typ CartItem
				id: menu.id,
				date: menu.date || '',  // Ošetříme null
				soup: menu.soup || '',  // Ošetříme null
				variants: [{
					id: variant.id,
					variant_number: variant.variant_number,
					description: variant.description,
					price: variant.price,
					quantity: 1
				}]
			};

			CartItemsStore.addItem(cartItem);
		}
	}
</script>

<div class="p-2 my-3 border rounded-lg bg-stone-100">
	<div class="py-1 bg-green-800 border rounded-lg shadow-md sm:py-3">
		<p class="pl-3 text-2xl font-bold tracking-tight text-gray-200">
			{formatDate(menu.date)}
		</p>
	</div>

	<div class="my-3 border rounded-lg shadow-md md:p-8">
		<p class="text-lg">Polévka</p>
		<div class="p-5 border rounded-2xl">
			<p class="p-2 text-lg">{menu.soup || 'Polévka není k dispozici'}</p>
		</div>

		<div class="py-2 text-lg rounded-2xl">
			<p class="text-lg mt-5">Hlavní jídlo</p>
			{#if menu.variants && menu.variants.length > 0}
				{#each menu.variants as variant (variant.id)}
					<div class="border rounded-2xl p-5">
						<div class="p-2 text-lg">
							{variant.description}
						</div>
						{#if !$page.data.session}
							<a href="/login" class="flex justify-end pt-2">
								<div class="py-4 px-8 border rounded-lg shadow-md hover:bg-white hover:shadow-xl transition duration-150 ease-in-out">
									<div class="text-base">Přihlaš se</div>
								</div>
							</a>
						{:else}
							<div
								class="flex justify-end pt-2"
								role="button"
								on:click={() => addToCart(variant)}
								on:keydown={(e) => e.key === "Enter" && addToCart(variant)}
								tabindex="0"
							>
								<div class="py-2 px-4 border rounded-lg shadow-md hover:bg-white hover:shadow-xl transition-all duration-150 ease-in-out cursor-pointer active:bg-green-800 active:text-white">
									<div class="">
										<p class="text-base justify-end flex">{variant.price} Kč</p>
										<p class="text-sm uppercase">Přidat do košíku</p>
									</div>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			{:else}
				<p>Žádné varianty nejsou k dispozici</p>
			{/if}
		</div>
	</div>
</div>

