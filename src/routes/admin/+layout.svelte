<script>
	import { ROUTES } from "$lib/stores/store"; //proč nefunguje pro globálni použití na stránkách?
</script>

<main class="my-20 pb-20">
	<div
		class="container mx-auto px-5 shadow-md sm:rounded-lg py-10 mt-5 font-sans border-zinc-200 border mb-20">
		<slot />
	</div>
</main>

<style>
</style>
