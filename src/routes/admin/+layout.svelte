<script>
	import { ROUTES } from "$lib/stores/store"; //proč nefunguje pro globálni použití na stránkách?
	import { page } from "$app/stores";

	// add shadows to specific pages
	const pagesWithShadow = [
		$ROUTES.ADMIN.SETTINGS,
	];

	$: withoutShadow = !pagesWithShadow.some(path =>
		$page.url.pathname.startsWith(path)
	);
</script>

<main class="my-20 pb-20">
	<div
		class="container mx-auto px-5 py-10 mt-5 font-sans  mb-20"
		class:shadow-md={withoutShadow}
    class:sm:rounded-lg={withoutShadow}
    class:border-zinc-200={withoutShadow}
		class:border={withoutShadow}>
		<slot />
	</div>
</main>

<style>
</style>
