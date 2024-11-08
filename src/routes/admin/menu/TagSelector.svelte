<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { Tag, TagType, TagUpdateEvent } from "$lib/types/tag";

	// Component props with improved typing
	export let selectedTags: Tag[] = [];
	export let availableTags: Tag[] = [];
	export let type: TagType;

	// Ensure arrays are initialized with proper typing
	$: {
		selectedTags = Array.isArray(selectedTags) ? selectedTags : [];
		availableTags = Array.isArray(availableTags) ? availableTags : [];
	}

	// Create event dispatcher with proper typing
	const dispatch = createEventDispatcher<{
		update: TagUpdateEvent;
	}>();

	// State for input and filtered tags
	let inputValue = "";
	let filteredTags: Tag[] = [];

	// Reactive statement to filter available tags based on input
	$: {
		if (Array.isArray(availableTags) && Array.isArray(selectedTags)) {
			filteredTags = availableTags.filter(
				(tag): tag is Tag =>
					// Type guard to ensure tag is valid
					tag !== null &&
					tag !== undefined &&
					typeof tag.name === 'string' &&
					// Filter tags that include the input value (case-insensitive)
					tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
					// Exclude tags that are already selected
					!selectedTags.some((selected) => selected?.id === tag?.id)
			);
		} else {
			filteredTags = [];
		}
	}

	// Add a tag to the selected tags
	function addTag(tag: Tag) {
		if (!tag?.id || !tag?.name) return;

		// Check if the tag is not already in the selected tags
		if (!selectedTags.some((selected) => selected?.id === tag.id)) {
			// Create a new array with the new tag added (to trigger reactivity)
			selectedTags = [...selectedTags, tag];
			// Dispatch the update event with the new selectedTags array and type
			dispatch("update", { tags: selectedTags, type });
		}
		// Clear the input value after adding a tag
		inputValue = "";
	}

	// Remove a tag from the selected tags
	function removeTag(tag: Tag) {
		selectedTags = selectedTags.filter((t) => t.id !== tag.id);
		dispatch("update", { tags: selectedTags, type });
	}

	// Handle keydown event for adding tags
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === "Enter" && inputValue && filteredTags.length > 0) {
			event.preventDefault();
			addTag(filteredTags[0]);
		}
	}
</script>

<div class="tag-selector">
	<div class="selected-tags">
		{#each selectedTags as tag (tag.id)}
      <span class="tag">
        {tag.name}
				<button type="button" on:click={() => removeTag(tag)} class="tag-remove" aria-label="Odstranit tag">
          &times;
        </button>
      </span>
		{/each}
	</div>

	<input
		type="text"
		bind:value={inputValue}
		on:keydown={handleKeydown}
		placeholder={`Přidat ${type === 'allergen' ? 'alergen' : 'ingredienci'}...`}
		class="tag-input"
	/>

	{#if inputValue && filteredTags.length > 0}
		<ul class="tag-suggestions">
			{#each filteredTags as tag (tag.id)}
				<li on:click={() => addTag(tag)} on:keydown={(e) => e.key === 'Enter' && addTag(tag)} tabindex="0" role="button">
					{tag.name}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
    .tag-selector {
        position: relative;
        width: 100%;
    }

    .selected-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .tag {
        background-color: #e0e0e0;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        display: flex;
        align-items: center;
        font-size: 0.875rem;
    }

    .tag-remove {
        margin-left: 0.25rem;
        border: none;
        background: none;
        cursor: pointer;
        padding: 0 0.25rem;
        color: #666;
    }

    .tag-remove:hover {
        color: #000;
    }

    .tag-input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
        margin-bottom: 0.25rem;
    }

    .tag-suggestions {
        position: absolute;
        width: 100%;
        list-style-type: none;
        padding: 0;
        margin: 0;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
        background-color: white;
        max-height: 200px;
        overflow-y: auto;
        z-index: 10;
    }

    .tag-suggestions li {
        padding: 0.5rem;
        cursor: pointer;
    }

    .tag-suggestions li:hover {
        background-color: #f0f0f0;
    }
</style>