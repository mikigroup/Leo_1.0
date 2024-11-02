<script lang="ts">
	import { onMount } from "svelte";

	let step = 0;
	let interval: any;

	const startAnimation = () => {
		interval = setInterval(() => {
			step = (step + 1) % 4;
		}, 2000);
	};

	onMount(() => {
		startAnimation();
		return () => clearInterval(interval);
	});
</script>

<div class="relative min-h-screen bg-slate-50 p-4 overflow-hidden">
	<!-- První karta -->
	<div class="relative z-30 max-w-sm lg:ml-32 mt-12 bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform -rotate-6 hover:rotate-0 hover:scale-105">
		<div class="p-8 relative overflow-hidden group">
			<div class="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-20 group-hover:opacity-30 transition-opacity"></div>
			<div class="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold">
				1
			</div>
			<div class="ml-16">
				<h3 class="text-xl font-bold text-gray-900">Vytvořte účet</h3>
				<p class="mt-2 text-gray-600">Rychlá registrace pomocí emailu</p>
			</div>
		</div>
	</div>

	<!-- Centrální animace -->
	<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
		<!-- Rotující tečky -->
		<div class="absolute inset-0 animate-spin-slow">
			{#each Array(12) as _, i}
				<div
					class="absolute w-2 h-2 bg-blue-500 rounded-full"
					style="left: 50%; top: 50%; transform: rotate({i * 30}deg) translateY(-28px)">
				</div>
			{/each}
		</div>

		<!-- Centrální kruh s ikonami -->
		<div class="absolute inset-0 flex items-center justify-center">
			<div class="relative w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center overflow-hidden">
				<div
					class="relative z-10 flex transition-transform duration-500 ease-in-out"
					style="transform: translateX(-{step * 100}%)">
					<!-- Ikony -->
					<div class="flex-shrink-0 w-32 h-32 flex items-center justify-center">
						<svg class="w-16 h-16 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="10"></circle>
						</svg>
					</div>
					<div class="flex-shrink-0 w-32 h-32 flex items-center justify-center">
						<svg class="w-16 h-16 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="10"></circle>
							<path d="M12 6v6l4 2"></path>
						</svg>
					</div>
					<div class="flex-shrink-0 w-32 h-32 flex items-center justify-center">
						<svg class="w-16 h-16 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M20 6L9 17l-5-5"></path>
						</svg>
					</div>
					<div class="flex-shrink-0 w-32 h-32 flex items-center justify-center">
						<svg class="w-16 h-16 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M9 18l6-6-6-6"></path>
						</svg>
					</div>
				</div>
			</div>
		</div>

		<!-- Pulzující kruhy -->
		<div class="absolute inset-0 flex items-center justify-center">
			<div class="absolute w-48 h-48 bg-blue-500 rounded-full animate-ping-slow opacity-10"></div>
			<div class="absolute w-40 h-40 bg-blue-400 rounded-full animate-ping-slow opacity-20 delay-100"></div>
			<div class="absolute w-32 h-32 bg-blue-300 rounded-full animate-ping-slow opacity-30 delay-200"></div>
		</div>

		<!-- Text -->
		<div class="absolute -bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap">
			<div class="text-lg font-bold text-gray-700 text-center mb-2">
				Jednoduché objednání
			</div>
			<div class="text-sm text-gray-500 text-center">
				Vše zvládnete během pár kliknutí
			</div>
		</div>
	</div>

	<!-- Druhá karta -->
	<div class="relative z-20 max-w-sm ml-auto mr-32 mt-20 bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform rotate-3 hover:rotate-0 hover:scale-105">
		<div class="p-8 relative overflow-hidden group">
			<div class="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold">
				2
			</div>
			<div class="ml-16">
				<h3 class="text-xl font-bold text-gray-900">Vyberte si jídlo</h3>
				<p class="mt-2 text-gray-600">Z denní nabídky čerstvých jídel</p>
			</div>
		</div>
	</div>

	<!-- Třetí karta -->
	<div class="relative z-10 max-w-sm ml-48 mt-20 bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform -rotate-3 hover:rotate-0 hover:scale-105">
		<div class="p-8 relative overflow-hidden group">
			<div class="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold">
				3
			</div>
			<div class="ml-16">
				<h3 class="text-xl font-bold text-gray-900">Zaplaťte online</h3>
				<p class="mt-2 text-gray-600">Bezpečná platba kartou</p>
			</div>
		</div>
	</div>
</div>

<style>
    @keyframes ping-slow {
        75%, 100% {
            transform: scale(2);
            opacity: 0;
        }
    }

    @keyframes spin-slow {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .animate-spin-slow {
        animation: spin-slow 20s linear infinite;
    }

    .animate-ping-slow {
        animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    .delay-100 {
        animation-delay: 100ms;
    }

    .delay-200 {
        animation-delay: 200ms;
    }
</style>