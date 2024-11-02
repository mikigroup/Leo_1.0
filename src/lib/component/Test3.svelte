<div class="relative min-h-screen bg-slate-50 p-4 overflow-hidden">
	<!-- První karta - vlevo nahoře -->
	<div class="relative z-30 max-w-sm lg:ml-20 mt-20 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
		<div class="p-8">
			<div class="absolute top-4 left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
				1
			</div>
			<div class="ml-16">
				<h3 class="text-xl font-bold text-gray-900">Vytvořte účet</h3>
				<p class="mt-2 text-gray-600">Rychlá registrace pomocí emailu</p>
			</div>
		</div>
		<!-- Spojovací čára k druhé kartě -->
		<div class="absolute -right-16 bottom-1/2 w-32 h-40">
			<!-- Zakřivená čára pomocí border -->
			<div class="absolute w-32 h-40 border-r-2 border-b-2 border-blue-600 rounded-br-3xl"></div>
			<!-- Šipka na konci -->
			<div class="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 border-r-2 border-b-2 border-blue-600"></div>
		</div>
	</div>

	<!-- Druhá karta - vpravo uprostřed -->
	<div class="relative z-20 max-w-sm ml-auto mr-20 -mt-4 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
		<div class="p-8">
			<div class="absolute top-4 left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
				2
			</div>
			<div class="ml-16">
				<h3 class="text-xl font-bold text-gray-900">Vyberte si jídlo</h3>
				<p class="mt-2 text-gray-600">Z denní nabídky čerstvých jídel</p>
			</div>
		</div>
		<!-- Spojovací čára k třetí kartě -->
		<div class="absolute -left-16 bottom-0 w-32 h-40">
			<!-- Zakřivená čára pomocí border -->
			<div class="absolute w-32 h-40 border-l-2 border-b-2 border-blue-600 rounded-bl-3xl"></div>
			<!-- Šipka na konci -->
			<div class="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 border-r-2 border-b-2 border-blue-600"></div>
		</div>
	</div>

	<!-- Třetí karta - vlevo dole -->
	<div class="relative z-10 max-w-sm ml-32 mt-16 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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

	<!-- Pozadí s gradientem a efekty -->
	<div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 -z-10"></div>

	<!-- Dekorativní kruhy v pozadí -->
	<div class="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-100 rounded-full opacity-10 blur-xl"></div>
	<div class="absolute bottom-1/3 left-1/3 w-72 h-72 bg-blue-200 rounded-full opacity-10 blur-xl"></div>

	<!-- Dekorativní tečky -->
	<div class="absolute top-20 right-10 w-20 h-20 transform rotate-12">
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

	<!-- Jemné dekorativní linky -->
	<div class="absolute top-1/3 right-1/4 w-32 h-px bg-blue-200 transform rotate-45"></div>
	<div class="absolute bottom-1/3 left-1/4 w-32 h-px bg-blue-200 transform -rotate-45"></div>
</div>