<script lang="ts">
	export let data;
	let { texts } = data;
	$: ({ texts } = data);
</script>

<div class="relative min-h-screen bg-slate-50 p-4">
	<!-- První karta -->
	<div class="relative z-30 max-w-md ml-8 md:ml-16 mt-20 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
		<div class="p-8">
			<div class="absolute top-4 left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
				1
			</div>
			<div class="ml-16">
				<h3 class="text-xl font-bold text-gray-900">Vytvořte účet</h3>
				<p class="mt-2 text-gray-600">Rychlá registrace pomocí emailu</p>
			</div>
		</div>
		<!-- Vlnitá čára k další kartě -->
		<div class="absolute bottom-0 right-16 w-32 h-32 transform translate-y-16 rotate-45">
			<div class="w-full h-1 bg-blue-600"></div>
			<!-- Šipka -->
			<div class="absolute right-0 bottom-0 transform rotate-45 w-3 h-3 border-r-2 border-b-2 border-blue-600"></div>
		</div>
	</div>

	<!-- Druhá karta -->
	<div class="relative z-20 max-w-md ml-16 md:ml-48 mt-8 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
		<div class="p-8">
			<div class="absolute top-4 left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
				2
			</div>
			<div class="ml-16">
				<h3 class="text-xl font-bold text-gray-900">Vyberte si jídlo</h3>
				<p class="mt-2 text-gray-600">Z denní nabídky čerstvých jídel</p>
			</div>
		</div>
		<!-- Vlnitá čára k další kartě -->
		<div class="absolute bottom-0 right-16 w-32 h-32 transform translate-y-16 rotate-45">
			<div class="w-full h-1 bg-blue-600"></div>
			<!-- Šipka -->
			<div class="absolute right-0 bottom-0 transform rotate-45 w-3 h-3 border-r-2 border-b-2 border-blue-600"></div>
		</div>
	</div>

	<!-- Třetí karta -->
	<div class="relative z-10 max-w-md ml-24 md:ml-80 mt-8 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
		<div class="p-8">
			<div class="absolute top-4 left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
				3
			</div>
			<div class="ml-16">
				<h3 class="text-xl font-bold text-gray-900">Zaplaťte online</h3>
				<p class="mt-2 text-gray-600">Bezpečná platba kartou</p>
			</div>
		</div>
	</div>

	<!-- Pozadí s gradientem -->
	<div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 -z-10"></div>

	<!-- Dekorativní prvky -->
	<div class="absolute top-20 right-10 w-20 h-20 transform rotate-45">
		<div class="grid grid-cols-3 gap-2">
			{#each Array(9) as _}
				<div class="w-2 h-2 bg-blue-200 rounded-full"></div>
			{/each}
		</div>
	</div>

	<div class="absolute bottom-20 left-10 w-20 h-20 transform -rotate-12">
		<div class="grid grid-cols-3 gap-2">
			{#each Array(9) as _}
				<div class="w-2 h-2 bg-blue-200 rounded-full"></div>
			{/each}
		</div>
	</div>

	<!-- Doplňující dekorativní kruhy -->
	<div class="absolute top-1/4 right-1/3 w-64 h-64 bg-blue-100 rounded-full opacity-10 blur-xl"></div>
	<div class="absolute bottom-1/4 left-1/3 w-48 h-48 bg-blue-200 rounded-full opacity-10 blur-xl"></div>
</div>