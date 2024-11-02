<script lang="ts">
	import Test from "$lib/component/Test.svelte"
	export let data;
	let { texts } = data;
	$: ({ texts } = data);
</script>

<svelte:head>
	<title>Objednávkový systém obědů - Leo</title>
	<meta name="description" content="Jednoduché online objednávání obědů" />
</svelte:head>


<Test />



<section>
	<div class="max-w-screen-xl p-4 mx-auto sm:px-6 lg:px-8 py-26 lg:mt-10">
		<div class="">
			<div class="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
				<div class="px-10 py-10 ml-auto bg-white rounded-md shadow-lg lg:col-start-2 lg:max-w-2xl">
					<h2 class="mt-2 text-3xl font-extrabold leading-8 text-slate-700 lg:text-4xl sm:leading-9">
						Obědy podle vašich představ
					</h2>
					<h3 class="mt-3 text-xl leading-6 text-gray-500">
						Jednoduché online objednávání
					</h3>
					<ul class="p-5 mt-8 rounded-lg md:grid md:grid-cols-2 md:gap-3 sm:gap-1 bg-slate-50">
						<li class="mt-6 lg:mt-0">
							<div class="flex">
                <span class="flex items-center justify-center flex-shrink-0 w-6 h-6 text-green-800 bg-green-100 rounded-full">
                  <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </span>
								<span class="ml-4 text-base font-medium leading-6 text-gray-600">
                  Objednávejte do 14:00
                </span>
							</div>
						</li>
						<li class="mt-6 lg:mt-0">
							<div class="flex">
                <span class="flex items-center justify-center flex-shrink-0 w-6 h-6 text-green-800 bg-green-100 rounded-full">
                  <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </span>
								<span class="ml-4 text-base font-medium leading-6 text-gray-600">
                  Denně čerstvé menu
                </span>
							</div>
						</li>
						<li class="mt-6 lg:mt-0">
							<div class="flex">
                <span class="flex items-center justify-center flex-shrink-0 w-6 h-6 text-green-800 bg-green-100 rounded-full">
                  <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </span>
								<span class="ml-4 text-base font-medium leading-6 text-gray-600">
                  Rozvoz zdarma
                </span>
							</div>
						</li>
						<li class="mt-6 lg:mt-0">
							<div class="flex">
                <span class="flex items-center justify-center flex-shrink-0 w-6 h-6 text-green-800 bg-green-100 rounded-full">
                  <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </span>
								<span class="ml-4 text-base font-medium leading-6 text-gray-600">
                  Online platba
                </span>
							</div>
						</li>
					</ul>
					<div class="flex justify-center mt-8 space-x-4">
						<a href="/menu" class="px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
							Zobrazit menu
						</a>
						<a href="/register" class="px-8 py-3 text-lg font-semibold text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
							Registrace
						</a>
					</div>
				</div>
				<div class="relative mt-10 lg:-mx-4 relative-20 lg:mt-0 lg:col-start-1">
					<div class="relative space-y-4">
						<div class="flex items-end justify-center space-x-4 lg:justify-start">
							<img class="w-32 rounded-lg shadow-lg md:w-56 floating-img" width="200" src="meal_01.jpg" alt="Oběd 1" />
							<img class="w-40 rounded-lg shadow-lg md:w-64 floating-img2" width="260" src="meal_02.webp"
									 alt="Oběd 2" />
						</div>
						<div class="flex items-start justify-center ml-12 space-x-4 lg:justify-start">
							<img class="w-24 rounded-lg shadow-lg md:w-40 floating-img2" width="170" src="meal_03.avif" alt="Oběd 3" />
							<img class="w-32 rounded-lg shadow-lg md:w-56 floating-img" width="200" src="meal_04.jpg" alt="Oběd 4" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="py-16 bg-gray-50">
	<div class="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
		<div class="text-center">
			<h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
				Jak to funguje?
			</h2>
		</div>
		<div class="grid gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3">
			<div class="p-6 bg-white rounded-lg shadow-lg">
				<div class="inline-flex items-center justify-center w-12 h-12 mb-4 text-blue-600 bg-blue-100 rounded-full">1</div>
				<h3 class="text-lg font-semibold text-gray-900">Vytvořte si účet</h3>
				<p class="mt-2 text-gray-600">Rychlá registrace bez zbytečných údajů. Stačí email a heslo.</p>
			</div>
			<div class="p-6 bg-white rounded-lg shadow-lg">
				<div class="inline-flex items-center justify-center w-12 h-12 mb-4 text-blue-600 bg-blue-100 rounded-full">2</div>
				<h3 class="text-lg font-semibold text-gray-900">Vyberte si z menu</h3>
				<p class="mt-2 text-gray-600">Každý den nové menu. Objednávky přijímáme do 14:00 na další den.</p>
			</div>
			<div class="p-6 bg-white rounded-lg shadow-lg">
				<div class="inline-flex items-center justify-center w-12 h-12 mb-4 text-blue-600 bg-blue-100 rounded-full">3</div>
				<h3 class="text-lg font-semibold text-gray-900">Zaplaťte online</h3>
				<p class="mt-2 text-gray-600">Bezpečná platba kartou nebo převodem. Kredit můžete dobíjet.</p>
			</div>
		</div>
	</div>
</section>


<section>
	<div class="">
		<div class="mt-20">
			<h2
				class="mb-4 mb-10 text-4xl font-extrabold tracking-tight text-center text-gray-900 lg:text-5xl">
				Info koutek
			</h2>
		</div>
		<div
			class="flex-wrap items-center justify-center gap-8 md:container md:mx-auto sm:flex">
			<div
				class="w-full px-4 rounded-lg shadow-lg sm:w-1/2 md:w-1/2 lg:w-1/4 bg-slate-50">
				<h3 class="px-5 pt-10 text-3xl font-semibold text-gray-700 sm:text-xl">
					Info na Prosinec 2022
				</h3>
				<hr class="mx-5" />
				<p class="p-5 mb-5 text-gray-600 text-md">
					Rok 2022 končí a my musíme vybrat ještě nějakou tu dovolenou, řádně
					oslavit svátky a trochu se zklidnit . 23.12., 30.12. dovolená. 26.12.
					Vánoční svátek. A 27.12., 28.12., 29.12. vaříme jen jedno jídlo.
				</p>
			</div>
			<div
				class="w-full px-4 rounded-lg shadow-lg sm:w-1/2 md:w-1/2 lg:w-1/4 bg-slate-50">
				<h3 class="px-5 pt-10 text-3xl font-semibold text-gray-700 sm:text-xl">
					2023 a kudy kam
				</h3>
				<hr class="mx-5" />
				<p class="p-5 mb-5 text-gray-600 text-md">
					Kam si to v tom Šťastném srdci směřujeme? Vize "Kudy kam" pro další
					roky máme. Zda je naplníme, je teď ve hvězdách. Nicméně trpělivě a
					krok po kroku k naplnění míříme. A tak pro tento rok, chceme rozšířit
					záhony s bylinami a zeleninou, pokračovat v uvědomělém kompostování
					celé hory slupek zeleniny a ovoce, pravidelně vytvářet picles
					(rychlokvašenou zeleninu) a zkusit používat na některé vařiče
					bioplynku.
				</p>
			</div>
			<div
				class="w-full px-4 rounded-lg shadow-lg sm:w-1/2 md:w-1/2 lg:w-1/4 bg-slate-50">
				<h3 class="px-5 pt-10 text-3xl font-semibold text-gray-700 sm:text-xl">
					Pro vegetariány a vegany!
				</h3>
				<hr class="mx-5" />
				<p class="p-5 mb-5 text-gray-600 text-md">
					Naše "bezmasé trojky", potřebují posunout na vyšší level. Strávníků,
					kteří nechtějí jíst každý den maso přibývá. A my máme radost, že se
					trojky svým množstvím vyrovnají masitým meníčkům. Jenomže k nám
					nepřichází veganská (vegetariánská) inspirace a tak vyzýváme milovníky
					zvířat, napište email, co byste rádi na jídelníčku.
				</p>
			</div>
		</div>
	</div>
</section>



<style lang="postcss">
    .floating-img {
        transform: translateY(0%);
        transition: ease 0.5s;
    }
    .floating-img2 {
        transform: translateX(0%);
        transition: ease 0.5s;
    }
    @keyframes floater-y {
        0% {
            transform: translateY(-10%);
            transition: ease 0.5s;
        }
        50% {
            transform: translateY(10%);
            transition: ease 0.5s;
        }
    }
    @keyframes floater-x {
        0% {
            transform: translateX(-10%);
            transition: ease 0.5s;
        }
        50% {
            transform: translateX(10%);
            transition: ease 0.5s;
        }
    }
</style>