<script lang="ts">
	export let data;
	let { texts } = data;
	$: ({ texts } = data);
</script>

<svelte:head>
	<title>Objednávkový systém obědů - Leo</title>
	<meta name="description" content="Jednoduché online objednávání obědů" />
</svelte:head>

<section class="bg-slate-50 md:m-5 xl:m-20 pt-20">
	<div class="max-w-screen-xl mx-auto sm:px-6 lg:px-8 py-26">
		<div class="mb-20">
			<div
				class="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center pb-20">
				<div
					class="px-10 py-10 ml-auto bg-white rounded-md border shadow-md lg:col-start-2 lg:max-w-2xl">
					<h1
						class="mt-2 text-3xl font-extrabold leading-8 text-slate-700 lg:text-4xl sm:leading-9">
						Jednoduché online objednávání
					</h1>
					<h2 class="mt-3 text-xl leading-6 text-gray-500">
						Obědy podle vašich představ
					</h2>
					<ul
						class="p-5 mt-8 rounded-lg md:grid md:grid-cols-2 md:gap-3 sm:gap-1 bg-slate-50">
						<li class="mt-6 lg:mt-0">
							<div class="flex">
								<span
									class="flex items-center justify-center flex-shrink-0 w-6 h-6 text-green-800 bg-green-100 rounded-full">
									<svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd" />
									</svg>
								</span>
								<span
									class="ml-4 text-base font-medium leading-6 text-gray-600">
									Jednoduchý
								</span>
							</div>
						</li>
						<li class="mt-6 lg:mt-0">
							<div class="flex">
								<span
									class="flex items-center justify-center flex-shrink-0 w-6 h-6 text-green-800 bg-green-100 rounded-full">
									<svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd" />
									</svg>
								</span>
								<span
									class="ml-4 text-base font-medium leading-6 text-gray-600">
									Moderní
								</span>
							</div>
						</li>
						<li class="mt-6 lg:mt-0">
							<div class="flex">
								<span
									class="flex items-center justify-center flex-shrink-0 w-6 h-6 text-green-800 bg-green-100 rounded-full">
									<svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd" />
									</svg>
								</span>
								<span
									class="ml-4 text-base font-medium leading-6 text-gray-600">
									Automatizovaný
								</span>
							</div>
						</li>
						<li class="mt-6 lg:mt-0">
							<div class="flex">
								<span
									class="flex items-center justify-center flex-shrink-0 w-6 h-6 text-green-800 bg-green-100 rounded-full">
									<svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd" />
									</svg>
								</span>
								<span
									class="ml-4 text-base font-medium leading-6 text-gray-600">
									Flexibilní
								</span>
							</div>
						</li>
					</ul>
					<div class="flex justify-center mt-8 space-x-4">
						<button class="flex items-center justify-center">
							<a
								class="px-10 pt-7 pb-14 border-2 border-orange-400 btn rounded-xl hover:bg-gray-700 htransition-all duration-300 ease-in-out hover:text-white text-lg"
								href="/jidelnicek">Zobrazit menu
							</a>
						</button>
						<button class="">
							<a
								class="px-10 pt-7 pb-14 border-2 border-green-600 btn rounded-xl hover:bg-gray-700 transition-all duration-300 ease-in-out hover:text-white text-lg"
								href="/signup">Registrace
							</a>
						</button>
					</div>
				</div>
				<div class="">
					<img class="rounded-lg" src="meal01.avif" alt="Oběd 1" />
				</div>
			</div>
		</div>
	</div>
</section>

<section class="py-40 argumenty">
	<div class="max-w-screen-2xl px-4 mx-auto sm:px-6 lg:px-8">
		<div class="text-center">
			<h2 class="mb-10 text-4xl font-extrabold tracking-tight text-center text-white lg:text-5xl">
				Jak to funguje?
			</h2>
		</div>
		<div
			class="grid gap-8 mt-12 lg:grid-cols-2 xl:grid-cols-4 shadow-2xl md:p-10 lg:p-20 border-gray-300 border rounded-xl">
			<div class="p-6 bg-white rounded-lg shadow-lg">
				<div
					class="inline-flex items-center justify-center w-12 h-12 mb-4 text-blue-600 bg-blue-100 rounded-full">
					1
				</div>
				<h3 class="text-lg font-semibold text-gray-900 text-nowrap">Registrujte se</h3>
				<p class="mt-2 text-gray-600">
					Rychlá registrace bez zbytečných údajů - stačí email a heslo.
				</p>
			</div>
			<div class="p-6 bg-white rounded-lg shadow-lg">
				<div
					class="inline-flex items-center justify-center w-12 h-12 mb-4 text-blue-600 bg-blue-100 rounded-full">
					2
				</div>
				<h3 class="text-lg font-semibold text-gray-900 text-nowrap">Nastavte eshop</h3>
				<p class="mt-2 text-gray-600">
					Fakturační adresa, texty do info koutku, popis meníček, nastavení emailové šablony.
				</p>
			</div>
			<div class="p-6 bg-white rounded-lg shadow-lg">
				<div
					class="inline-flex items-center justify-center w-12 h-12 mb-4 text-blue-600 bg-blue-100 rounded-full">
					3
				</div>
				<h3 class="text-lg font-semibold text-gray-900 text-nowrap">Vytvořte meníčko</h3>
				<p class="mt-2 text-gray-600">
					Každý den nové menu. Objednávky přijímáme do 14:00 na další den.
				</p>
			</div>
			<div class="p-6 bg-white rounded-lg shadow-lg">
				<div
					class="inline-flex items-center justify-center w-12 h-12 mb-4 text-blue-600 bg-blue-100 rounded-full">
					4
				</div>
				<h3 class="text-lg font-semibold text-gray-900 text-nowrap">Nyní jen čekejte objednávky</h3>
				<p class="mt-2 text-gray-600">
					Odeslání emailové notikace se souhrnem objednávky.
				</p>
			</div>
		</div>
	</div>
</section>

<section>
	<div
		class="infoKoutek bg-gradient-to-r from-cyan-700 from-60% to-blue-700 py-40">
		<div class="mt-10">
			<h3
				class="mb-10 text-4xl font-extrabold tracking-tight text-center text-white lg:text-5xl">
				Info koutek
			</h3>
		</div>
		<div class="justify-center gap-8 mx-auto lg:grid-cols-3 grid p-5">
			<div
				class="w-full px-4 rounded-lg bg-slate-50 pb-5 mb-5">
				<h4 class="px-5 pt-10 text-3xl font-semibold text-gray-700 sm:text-xl">
					Kompostování a udržitelnost
				</h4>
				<hr class="mx-5" />
				<p class="p-5 mb-5 text-gray-600 text-md">
					Nadále se budeme soustředit na snižování potravinového odpadu a
					udržitelné hospodaření. Veškeré slupky, zbytky a nedojedky poputují do
					našeho kompostéru, abychom z nich později vytvořili živnou půdu pro
					naši zahrádku.
				</p>
			</div>
			<div
				class="w-full px-4 rounded-lg shadow-lg bg-slate-50 pxb-5 mb-5">
				<h4 class="px-5 pt-10 text-3xl font-semibold text-gray-700 sm:text-xl">
					Rozšíření našich záhonů
				</h4>
				<hr class="mx-5" />
				<p class="p-5 mb-5 text-gray-600 text-md">
					V nadcházejícím roce plánujeme rozšířit naše záhony pro pěstování
					bylin a zeleniny. Chceme být co nejvíce soběstační a zajistit si
					čerstvé ingredience přímo z našeho dvorku. Věříme, že nám to pomůže
					zlepšit chuť a kvalitu našich pokrmů.
				</p>
			</div>
			<div
				class="w-full px-4 rounded-lg shadow-lg bg-slate-50 pxb-5 mb-5">
				<h4 class="px-5 pt-10 text-3xl font-semibold text-gray-700 sm:text-xl">
					Nové výzvy a experimenty
				</h4>
				<hr class="mx-5" />
				<p class="p-5 mb-5 text-gray-600 text-md">
					Rádi bychom v roce 2023 experimentovali s novými technologiemi, jako
					jsou například bioplynové vařiče. Věříme, že nám to pomůže snížit
					uhlíkovou stopu a posunout se k ještě šetrnějšímu provozu.
				</p>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	@use "$lib/styles/variables" as *;

  .argumenty {
    background: radial-gradient(
                    circle at center,
                    rgba(116, 138, 144, 1) 0%,
                    rgba(87, 120, 119, 1) 50%,
                    rgba(67, 101, 90, 1) 100%
    );
  }
</style>
