<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let versions: any[] = [];
	export let selectedVersion: any;

	const dispatch = createEventDispatcher();

	function selectVersion(version: any) {
		dispatch('select', version);
	}

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString('cs-CZ', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="overflow-x-auto">
	<div class="flex items-center space-x-4 p-4">
		{#each versions as version (version.id)}
			<button
				class="flex flex-col items-center p-2 rounded-lg border
               {selectedVersion?.id === version.id ? 'bg-primary text-white' : 'hover:bg-gray-100'}"
				on:click={() => selectVersion(version)}>
        <span class="text-sm font-medium">
          {formatDate(version.valid_from)}
        </span>
				<span class="text-xs">
          {version.valid_to ? 'Neaktuální' : 'Aktuální'}
        </span>
			</button>
		{/each}
	</div>
</div>