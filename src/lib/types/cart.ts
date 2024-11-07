export interface CartItem {
	id: string;
	date: string | null;
	soup: string | null;
	variants: CartMenuVariant[];
}

export interface CartMenuVariant {
	id: string;
	variant_number: string;
	description: string;
	price: number;
	quantity: number;
}