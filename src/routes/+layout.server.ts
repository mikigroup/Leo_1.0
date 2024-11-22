import type { LayoutServerLoad } from './$types'
import { redirect } from "@sveltejs/kit";

export const load = (async ({ url, locals: { safeGetSession }, cookies  }) => {
	const { session, user } = await safeGetSession();

	if (!user && url.pathname === "/kosik") {
		throw redirect(302, "/");
	}

	return {
		session,
		user,
		cookies: cookies.getAll(),
	};
}) satisfies LayoutServerLoad;
