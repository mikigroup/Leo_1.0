<section>
		<div class="relative min-h-screen bg-slate-50 p-4">
			<!-- První karta -->
			<div class="relative z-10 max-w-md mx-auto mt-20 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
				<div class="p-8">
					<div class="absolute top-4 left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
						1
					</div>
					<div class="ml-16">
						<h3 class="text-xl font-bold text-gray-900">Vytvořte účet</h3>
						<p class="mt-2 text-gray-600">Rychlá registrace pomocí emailu</p>
					</div>
				</div>
			</div>

			<!-- Vlnitá čára 1 -->
			<div class="relative z-0 mx-auto" style="width: 3px; height: 100px;">
				<div class="absolute left-1/2 h-full w-1 bg-blue-600 transform -translate-x-1/2"
						 style="clip-path: path('M 0 0 Q 20 50 0 100');">
				</div>
				<!-- Šipka -->
				<div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 border-r-2 border-b-2 border-blue-600"></div>
			</div>

			<!-- Druhá karta -->
			<div class="relative z-10 max-w-md mx-auto mt-16 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
				<div class="p-8">
					<div class="absolute top-4 left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
						2
					</div>
					<div class="ml-16">
						<h3 class="text-xl font-bold text-gray-900">Vyberte si jídlo</h3>
						<p class="mt-2 text-gray-600">Z denní nabídky čerstvých jídel</p>
					</div>
				</div>
			</div>

			<!-- Vlnitá čára 2 -->
			<div class="relative z-0 mx-auto" style="width: 3px; height: 100px;">
				<div class="absolute left-1/2 h-full w-1 bg-blue-600 transform -translate-x-1/2"
						 style="clip-path: path('M 0 0 Q -20 50 0 100');">
				</div>
				<!-- Šipka -->
				<div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 border-r-2 border-b-2 border-blue-600"></div>
			</div>

			<!-- Třetí karta -->
			<div class="relative z-10 max-w-md mx-auto mt-16 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
			<div class="absolute inset-0 bg-gradient-to-b from-blue-50 to-white -z-10"></div>

			<!-- Dekorativní tečky -->
			<div class="absolute top-20 right-10 w-20 h-20 transform rotate-45">
				<div class="grid grid-cols-3 gap-2">
					{#each Array(9) as _}
						<div class="w-2 h-2 bg-blue-200 rounded-full"></div>
					{/each}
				</div>
			</div>

			<div class="absolute bottom-20 left-10 w-20 h-20 transform -rotate-45">
				<div class="grid grid-cols-3 gap-2">
					{#each Array(9) as _}
						<div class="w-2 h-2 bg-blue-200 rounded-full"></div>
					{/each}
				</div>
			</div>
		</div>
</section>