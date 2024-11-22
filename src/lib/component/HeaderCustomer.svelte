<script lang="ts">
	import { page } from "$app/stores";
	import { totalPiecesStore } from "$lib/stores/store";
	import { goto } from "$app/navigation";
	import { readable } from "svelte/store";
	import { slide } from "svelte/transition";

	export let data: any;
	let { supabase, session, user } = data;
	$: ({ supabase, session, user } = data);

	async function signOut() {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			await goto("/");
		} catch (error) {
			console.error("Error logging out:", error);
		}
	}

	let src = "/android-chrome-192x192.png";

	let loading = false;
	const weekdays = [
		"Neděle",
		"Pondělí",
		"Úterý",
		"Středa",
		"Čtvrtek",
		"Pátek",
		"Sobota"
	];

	const formatterDate = new Intl.DateTimeFormat("cs", {
		month: "short",
		day: "numeric"
	});

	const formatterTime = new Intl.DateTimeFormat("cs", {
		hour12: false,
		hour: "numeric",
		minute: "2-digit"
	});

	const currentDate = readable(new Date(), function start(set) {
		const interval = setInterval(() => {
			set(new Date());
		}, 1000);

		return function stop() {
			clearInterval(interval);
		};
	});

	let day = "";
	$: {
		if ($currentDate) {
			const dayIndex = $currentDate.getDay();
			day = weekdays[dayIndex];
		}
	}

	let menuVisible = false;

	function toggleMenu() {
		menuVisible = !menuVisible;
	}

	$: totalPieces = $totalPiecesStore;
</script>

<header class="bg-white">
	<nav>
		<div class="grid grid-cols-2 m-2 mx-auto md:grid-cols-3 max-w-8xl">
			<div
				class="grid items-center w-full grid-cols-2 py-4 mx-4 lg:px-8 lg:mx-0">
				<div class="grid grid-cols-2">
					<h1
						class="grid items-center text-xl font-semibold animate__flipInX animate__animated animate__delay-2s">
						<a href="/">Malý LEO</a>
					</h1>
					<img
						{src}
						alt="maly_leo"
						class="pt-1"
						width="40"
					/>
				</div>
				<!-- čas -->
				<div class="grid grid-cols-2 justify-center w-80 text-md">
					<time class=""
					>{day}<span class="pr-2">&nbsp;</span>{formatterDate.format(
						$currentDate
					)}<span class="pr-2">&nbsp;</span>{formatterTime.format($currentDate)}</time>
				</div>
			</div>
			<!-- menu -->
			<div
				class="items-center hidden m-2 grid-cols-4 text-center border-2 rounded-xl lg:grid md:grid bg-slate-50">
				<div class="border-r-2 text-slate-600" id="">
					<a class="navItem" href="/">Úvod</a>
				</div>
				<div class="border-r-2 text-slate-600">
					<a class="navItem" href="/jidelnicek"> Jídelníček </a>
				</div>
				<div class="border-r-2 text-slate-600">
					<a class="navItem" href="/kontakt"> Kontakt </a>
				</div>
				<div class="text-slate-600">
					<a class="navItem" href="/kosik">
						Košík
						{#if $page.data.session}
							<strong>{totalPieces}</strong>
						{/if}
					</a>
				</div>
			</div>

			<div class="flex items-center justify-self-end">
				{#if $page.data.session}
					<!-- pravá část menu -->
					<div
						class="relative items-center hidden grid-cols-2 ml-auto lg:grid md:flex">
						<div class="flex pr-2">
							<button>
							<a
								class="p-2 px-6 border-2 border-gray-400 btn rounded-xl hover:text-white"
								href="/profile">Účet</a>
							</button>
						</div>
						<div class="">
							<button
								on:click={signOut}
								disabled={loading}
								class="p-2 px-6 border-2 border-gray-400 btn rounded-xl hover:text-white ">
								Odhlásit
							</button>
						</div>
					</div>
				{:else}
					<div class="relative items-center hidden grid-cols-2 ml-auto md:grid">
						<div class="flex pr-2">
							<button>
							<a
								class="p-2 px-6 border-2 border-gray-400 btn rounded-xl hover:border-green-700 transition-all duration-300 ease-in-out hover:text-white"
								href="/signup">
								Registrace</a>
							</button>
						</div>
						<div class="flex">
							<button>
							<a
								class="p-2 px-6 border-2 border-gray-400 btn rounded-xl hover:border-green-700 transition-all duration-300 ease-in-out hover:text-white"
								href="/login">Přihlášení
							</a>
							</button>
						</div>
					</div>
				{/if}
				<div class="md:hidden">
					{#if !totalPieces}{:else}
						<strong>{totalPieces}</strong>
					{/if}
				</div>
				<div class="grid justify-center md:hidden">
					<button on:click={toggleMenu} class="text-xl p-2 rounded mobile-menu-btn">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-7 w-7"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
				</div>
			</div>
		</div>

		 <!-- Mobilní menu -->
		<div
			class="flex flex-row-reverse justify-center text-lg tracking-wide text-center bg-white md:hidden">
			{#if menuVisible}
				<ul
					id="menu-box"
					transition:slide={{ duration: 400, delay: 2 }}
					class="mb-4">
					<hr />
					<div class="mt-4">
						<a class="navItem" href="/">Úvod</a>
					</div>
					<div>
						<a class="navItem" href="/jidelnicek">Jídelníček</a>
					</div>
					<div>
						<a class="navItem" href="/kontakt">Kontakt</a>
					</div>
					<div>
						<a class="navItem" href="/kosik">Košík</a>
					</div>
					<div class="grid grid-cols-2 mt-6">
						{#if $page.data.session}
							<div class="col-end-2 pr-2">
								<button
									class="p-1 px-6 text-sm text-blue-800 border border-blue-700 btn rounded-3xl hover:text-white hover:bg-blue-800"
									><a href="/profile">Účet</a>
								</button>
							</div>
							<div class="">
								<button
									on:click={signOut}
									disabled={loading}
									class="p-1 px-6 text-sm text-blue-800 border border-blue-700 btn rounded-3xl hover:text-white hover:bg-blue-800">
									Odhlásit
								</button>
							</div>
						{:else}
							<div class="col-end-2 pr-2">
								<button>
								<a
									class="p-1 px-6 text-sm text-blue-800 border border-blue-700 btn rounded-3xl hover:text-white hover:bg-blue-800"
									href="/login">Přihlásit</a>
								</button>
							</div>
							<div class="">
								<button>
								<a
									class="p-1 px-6 text-sm text-blue-800 border border-blue-700 btn rounded-3xl hover:text-white hover:bg-blue-800"
									href="/signup">
									Přidej se
								</a>
								</button>
							</div>
						{/if}
					</div>
				</ul>
			{/if}
		</div>
		<hr class="mx-4" />
	</nav>
</header>

<style lang="scss">
  @use "$lib/styles/variables" as vars;

  button {
    a {
      &:hover {
        background-color: vars.$button-main-color;
      }
    }

    &:not(:has(a)):hover {
      background-color: vars.$button-main-color;
    }
  }

  .mobile-menu-btn {
    &:hover {
      @apply bg-white text-black;
    }
  }
</style>
