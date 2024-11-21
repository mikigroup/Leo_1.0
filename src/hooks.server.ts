import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { createServerClient } from '@supabase/ssr'
import { type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

const supabase: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				event.cookies.set(key, value, { ...options, path: '/' })
			},
			remove: (key, options) => {
				event.cookies.delete(key, { ...options, path: '/' })
			}
		}
	})

	event.locals.safeGetSession = async () => {
		const { data: { session } } = await event.locals.supabase.auth.getSession()
		if (!session) return { session: null, user: null }

		const { data: { user }, error } = await event.locals.supabase.auth.getUser()
		if (error) return { session: null, user: null }

		return { session, user }
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version'
		}
	})
}

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession()
	event.locals.session = session
	event.locals.user = user

	if (event.url.pathname.startsWith("/admin")) {
		if (!session && event.url.pathname !== "/admin/signin") {
			throw redirect(303, "/admin/signin")
		}

		if (session && event.url.pathname === "/admin/signin") {
			throw redirect(303, "/admin")
		}
	} else {
		if (!session && event.url.pathname.startsWith("/private")) {
			throw redirect(303, "/login")
		}

		if (session && event.url.pathname === "/login") {
			throw redirect(303, "/")
		}
	}

	return resolve(event)
}

export const handle = sequence(supabase, authGuard)