import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import type { Menu, CartItem } from "$lib/types";

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{
				session: Session | null;
				user: User | null;
			}>;
			session: Session | null;
			user: User | null;
			cartItems: CartItem[];
		}

		interface PageData {
			session: Session | null;
			user: User | null;
			menus?: Menu[];
			weeks?: Menu[][];
			texts?: {
				text: string;
				title: string;
			};
		}
	}
}