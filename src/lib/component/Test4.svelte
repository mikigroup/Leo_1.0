
<div class="relative min-h-screen bg-slate-50 p-4 overflow-hidden">
	<!-- První karta - vlevo nahoře s rotací -->
	<div class="relative z-30 max-w-sm lg:ml-32 mt-12 bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform -rotate-6 hover:rotate-0 hover:scale-105">
		<div class="p-8 relative overflow-hidden group">
			<!-- Animovaný gradient border -->
			<div class="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-20 group-hover:opacity-30 transition-opacity"></div>
			<div class="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold transform group-hover:scale-110 transition-transform">
				1
			</div>
			<div class="ml-16">
				<h3 class="text-xl font-bold text-gray-900">Vytvořte účet</h3>
				<p class="mt-2 text-gray-600">Rychlá registrace pomocí emailu</p>
			</div>
		</div>
		<!-- Spojovací čára s animací -->
		<div class="absolute -right-24 top-1/2 w-48 h-48">
			<svg class="w-full h-full" viewBox="0 0 100 100" fill="none">
				<path d="M 0 50 Q 50 0, 100 50" stroke="url(#blue-gradient)" stroke-width="2" class="path-animation" stroke-dasharray="4,4"/>
				<!-- Šipka -->
				<path d="M 95 45 L 100 50 L 95 55" stroke="#3B82F6" stroke-width="2"/>
			</svg>
		</div>
	</div>

	<!-- Druhá karta - vpravo se sklonem -->
	<div class="relative z-20 max-w-sm ml-auto mr-32 mt-24 bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform rotate-3 hover:rotate-0 hover:scale-105">
		<div class="p-8 relative overflow-hidden group">
			<div class="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-20 group-hover:opacity-30 transition-opacity"></div>
			<div class="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold transform group-hover:scale-110 transition-transform">
				2
			</div>
			<div class="ml-16">
				<h3 class="text-xl font-bold text-gray-900">Vyberte si jídlo</h3>
				<p class="mt-2 text-gray-600">Z denní nabídky čerstvých jídel</p>
			</div>
		</div>
		<!-- Spojovací čára s animací -->
		<div class="absolute -left-24 bottom-0 w-48 h-48 transform -scale-x-100">
			<svg class="w-full h-full" viewBox="0 0 100 100" fill="none">
				<path d="M 0 50 Q 50 100, 100 50" stroke="url(#blue-gradient)" stroke-width="2" class="path-animation" stroke-dasharray="4,4"/>
				<!-- Šipka -->
				<path d="M 95 45 L 100 50 L 95 55" stroke="#3B82F6" stroke-width="2"/>
			</svg>
		</div>
	</div>

	<!-- Třetí karta - vlevo dole s opačnou rotací -->
	<div class="relative z-10 max-w-sm ml-48 mt-24 bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform -rotate-3 hover:rotate-0 hover:scale-105">
		<div class="p-8 relative overflow-hidden group">
			<div class="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-20 group-hover:opacity-30 transition-opacity"></div>
			<div class="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold transform group-hover:scale-110 transition-transform">
				3
			</div>
			<div class="ml-16">
				<h3 class="text-xl font-bold text-gray-900">Zaplaťte online</h3>
				<p class="mt-2 text-gray-600">Bezpečná platba kartou</p>
			</div>
		</div>
	</div>

	<!-- Dynamické pozadí -->
	<div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10"></div>

	<!-- Animované kruhy v pozadí -->
	<div class="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-100 rounded-full opacity-10 blur-xl animate-pulse"></div>
	<div class="absolute bottom-1/3 left-1/3 w-72 h-72 bg-purple-100 rounded-full opacity-10 blur-xl animate-pulse delay-700"></div>

	<!-- Plovoucí dekorativní prvky -->
	<div class="absolute top-20 right-20 animate-bounce-slow">
		<div class="w-3 h-3 bg-blue-400 rounded-full opacity-30"></div>
	</div>
	<div class="absolute bottom-20 left-20 animate-bounce-slow delay-500">
		<div class="w-3 h-3 bg-purple-400 rounded-full opacity-30"></div>
	</div>

	<!-- SVG definice pro gradienty -->
	<svg width="0" height="0" class="hidden">
		<defs>
			<linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
				<stop offset="0%" style="stop-color: #3B82F6; stop-opacity: 1"/>
				<stop offset="100%" style="stop-color: #60A5FA; stop-opacity: 1"/>
			</linearGradient>
		</defs>
	</svg>
</div>

<style>
    @keyframes path-animation {
        0% {
            stroke-dashoffset: 0;
        }
        100% {
            stroke-dashoffset: 20;
        }
    }

    .path-animation {
        animation: path-animation 2s linear infinite;
    }

    @keyframes bounce-slow {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-20px);
        }
    }

    .animate-bounce-slow {
        animation: bounce-slow 3s ease-in-out infinite;
    }

    .delay-500 {
        animation-delay: 500ms;
    }

    .delay-700 {
        animation-delay: 700ms;
    }
</style>