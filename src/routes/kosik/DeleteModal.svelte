<script lang="ts">
	export let showModal: boolean;
	export let message: string;
	export let title: string = "Potvrdit akci";
	export let onConfirm: () => void;

	let dialog: HTMLDialogElement;

	$: if (dialog && showModal) dialog.showModal();

	function closeModal() {
		dialog?.close();
		showModal = false;
	}
</script>

<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
	class="w-full max-w-lg rounded-lg shadow-lg p-0"
>
	<div on:click|stopPropagation class="p-6">
		<h2 class="text-xl font-semibold mb-4 text-center">{title}</h2>
		<p class="text-gray-600 mb-6 text-center">{message}</p>

		<div class="flex justify-center gap-4">
			<button
				class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
				on:click={closeModal}
			>
				Zrušit
			</button>
			<button
				class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
				on:click={() => {
          onConfirm();
          closeModal();
        }}
			>
				Odstranit
			</button>
		</div>
	</div>
</dialog>

<style>
    dialog {
        border: none;
    }
    dialog::backdrop {
        background: rgba(0, 0, 0, 0.3);
    }
    dialog[open] {
        animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes zoom {
        from {
            transform: scale(0.95);
        }
        to {
            transform: scale(1);
        }
    }
</style>