// +page.server.ts
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { type Provider } from "@supabase/supabase-js";

export type ActionData = {
	email: string;
	message: {
		success: boolean;
		display: string;
	};
};

export const actions: Actions = {
	handleLogin: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			console.error(error);
			return fail(400, {
				email,
				message: {
					success: false,
					display:
						"Neplatné přihlašovací údaje. Zkontrolujte prosím e-mail a heslo."
				}
			});
		} else {
			return { message: { success: true } };
		}
	}
};
