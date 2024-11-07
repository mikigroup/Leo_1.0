<script lang="ts">
	import { browser } from '$app/environment';
	import { totalPiecesStore } from "$lib/stores/store";
	import MenuWeekSelector from "./MenuWeekSelector.svelte";
	import MenuItem from "./MenuItem.svelte";
	import { page } from "$app/stores";

	// Podmíněný import DOMPurify
	let DOMPurify: any;

	export let data;
	let { weeks, text } = data;
	let selectedWeek = 0;
	let currentWeekMenus = weeks[0] || [];

	// Inicializace DOMPurify na klientské straně
	async function initDOMPurify() {
		if (browser) {
			DOMPurify = (await import('dompurify')).default;
		}
	}
	initDOMPurify();

	// Funkce pro sanitizaci HTML
	function sanitizeHtml(dirtyHtml: string | null): string {
		if (!dirtyHtml) return '';
		if (!browser || !DOMPurify) return dirtyHtml;

		return DOMPurify.sanitize(dirtyHtml, {
			ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br'],
			ALLOWED_ATTR: ['href', 'target', 'rel'],
		});
	}

	console.log('Page Data:', {
		weeks,
		text,
		selectedWeek,
		currentWeekMenus
	});

	$: totalPieces = $totalPiecesStore;

	function handleWeekSelect(event) {
		selectedWeek = event.detail.week;
		currentWeekMenus = weeks[selectedWeek] || [];
	}

	function scrollToTop(event) {
		event.preventDefault();
		document
			.getElementById("menu-content")
			?.scrollIntoView({ behavior: "smooth" });
	}
</script>

<svelte:head>
	<title>Šťastné srdce - Jídelníček</title>
	<meta name="description" content="Jídelníček" />
</svelte:head>

<main>
	<section class="max-w-screen-lg py-16 mx-auto mt-20 mb-10 rounded-lg md:px-4 bg-stone-100">
		<h1 class="mb-10 text-5xl font-extrabold tracking-tight text-center text-gray-900">
			Jídelníček
		</h1>

		<!-- Sekce s textem -->
		{#if text}
			<div class="max-w-4xl p-5 pb-2 mx-auto bg-white border-2 rounded-lg mb-3">
				{#if text.title}
					<h2 class="text-2xl font-bold mb-3">{text.title}</h2>
				{/if}
				{#if text.text}
					<div class="prose max-w-none">
						{@html sanitizeHtml(text.text)}
					</div>
				{/if}
			</div>
		{/if}

		<!-- Menu sekce -->
		<div class="max-w-4xl mx-auto mt-5 bg-white border-2 rounded-lg">
			<div class="pb-10" id="menu-content">
				<MenuWeekSelector {weeks} on:select={handleWeekSelect} />

				<div class="mt-10 border-2 md:mx-10 md:p-5 bg-orange-50">
					{#if currentWeekMenus && currentWeekMenus.length > 0}
						{#each currentWeekMenus as menu (menu.id)}
							<MenuItem {menu} />
						{/each}
					{:else}
						<p class="p-4 text-center text-gray-500">
							Žádný jídelníček nenalezen pro tento týden
						</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Navigační tlačítka -->
		<div class="flex justify-end gap-4 pt-10 pr-5">
			<a
			href="#menu-content"
			on:click={scrollToTop}
			class="px-4 py-2 text-center text-white bg-green-800 rounded-lg shadow-md hover:bg-green-900">
			Skoč nahoru
			</a>

			{#if totalPieces > 0 && $page.data.session}
				<a
				href="/kosik"
				class="px-4 py-2 text-center text-white bg-green-800 rounded-lg shadow-md hover:bg-green-900">
				Košík ({totalPieces})
				</a>
			{/if}
		</div>
	</section>
</main>