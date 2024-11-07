import { readable, writable } from "svelte/store";
import { ROUTES_STORE } from "$lib/stores/routes";
import type { Menu, CartItem, CartMenuVariant } from "$lib/types";

export const ROUTES = readable(ROUTES_STORE);

function createCartStore() {
	const { subscribe, set, update } = writable<CartItem[]>([]);

	// Funkce pro řazení podle datumu
	function sortByDate(items: CartItem[]): CartItem[] {
		return [...items].sort((a, b) => {
			if (!a.date || !b.date) return 0;
			const dateA = new Date(a.date);
			const dateB = new Date(b.date);
			return dateA.getTime() - dateB.getTime();
		});
	}

	// Funkce pro řazení variant
	function sortVariants(variants: CartMenuVariant[]): CartMenuVariant[] {
		return [...variants].sort((a, b) => {
			const aNum = parseInt(a.variant_number);
			const bNum = parseInt(b.variant_number);
			return aNum - bNum;
		});
	}

	// Funkce pro bezpečné načtení z localStorage
	function loadFromStorage(): CartItem[] {
		if (typeof window === "undefined") return [];

		try {
			const stored = localStorage.getItem("cartItems");
			if (!stored) return [];

			const items = JSON.parse(stored) as CartItem[];
			return sortByDate(items);
		} catch (error) {
			console.error("Error loading cart from storage:", error);
			return [];
		}
	}

	// Funkce pro bezpečné uložení do localStorage
	function saveToStorage(items: CartItem[]): void {
		if (typeof window === "undefined") return;

		try {
			localStorage.setItem("cartItems", JSON.stringify(items));
		} catch (error) {
			console.error("Error saving cart to storage:", error);
		}
	}

	// Inicializace store
	set(loadFromStorage());

	return {
		subscribe,
		addItem: (item: CartItem) => {
			update((items) => {
				const newItems = [...items];
				const existingItemIndex = items.findIndex((i) => i.id === item.id);

				if (existingItemIndex !== -1) {
					// Update existing item
					item.variants.forEach((newVariant) => {
						const existingVariantIndex = newItems[existingItemIndex].variants.findIndex((v) => v.id === newVariant.id);

						if (existingVariantIndex !== -1) {
							newItems[existingItemIndex].variants[existingVariantIndex].quantity += 1;
						} else {
							newItems[existingItemIndex].variants.push({
								...newVariant,
								quantity: 1
							});
							newItems[existingItemIndex].variants = sortVariants(newItems[existingItemIndex].variants);
						}
					});
				} else {
					// Add new item with sorted variants
					newItems.push({
						...item,
						variants: sortVariants(item.variants.map((v) => ({ ...v, quantity: 1 })))
					});
				}

				const sortedItems = sortByDate(newItems);
				saveToStorage(sortedItems);
				return sortedItems;
			});
		},
		updateQuantity: (itemId: string, variantId: string, quantity: number) => {
			update((items) => {
				const newItems = items
					.map((item) => {
						if (item.id === itemId) {
							return {
								...item,
								variants: sortVariants(
									item.variants.map((v) =>
										v.id === variantId ? { ...v, quantity } : v
									)
								)
							};
						}
						return item;
					})
					.filter((item) => item.variants.some((v) => v.quantity > 0));

				const sortedItems = sortByDate(newItems);
				saveToStorage(sortedItems);
				return sortedItems;
			});
		},
		removeItem: (itemId: string, variantId: string) => {
			update((items) => {
				const newItems = items
					.map((item) => {
						if (item.id === itemId) {
							return {
								...item,
								variants: sortVariants(
									item.variants.filter((v) => v.id !== variantId)
								)
							};
						}
						return item;
					})
					.filter((item) => item.variants.length > 0);

				const sortedItems = sortByDate(newItems);
				saveToStorage(sortedItems);
				return sortedItems;
			});
		},
		clear: () => {
			set([]);
			if (typeof window !== "undefined") {
				localStorage.removeItem("cartItems");
			}
		}
	};
}

export const CartItemsStore = createCartStore();

function createTotalPiecesStore() {
	const { subscribe, set } = writable<number>(0);

	CartItemsStore.subscribe(($cart) => {
		const total = $cart.reduce(
			(sum, item) =>
				sum + item.variants.reduce(
					(variantSum, variant) => variantSum + (variant.quantity || 0),
					0
				),
			0
		);
		set(total);
	});

	return { subscribe };
}

export const totalPiecesStore = createTotalPiecesStore();
export { ROUTES_STORE };