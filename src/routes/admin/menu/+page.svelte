<!-- src/routes/admin/menu/+page.svelte -->
<script lang="ts">
	import { goto } from "$app/navigation";
	import { fade } from "svelte/transition";
	import type { Menu } from "$lib/types/menu";
	import { formatVersionDate } from "$lib/utils/menuVersioning";
	import { ROUTES } from "$lib/stores/store";

	export let data;
	let { menus, pagination, filters } = data;
	$: ({ menus, pagination, filters } = data);

	interface Pagination {   page: number;  totalPages: number;   totalItems: (number | null);   itemsPerPage: number }

	// Column visibility management
	type Column = {
		id: string;
		label: string;
		visible: boolean;
	};

	let columns: Column[] = [
		{ id: 'date', label: 'Datum', visible: true },
		{ id: 'soup', label: 'Polévka', visible: true },
		{ id: 'variants', label: 'Varianty', visible: true },
		{ id: 'status', label: 'Stav', visible: true },
		{ id: 'changes', label: 'Změny', visible: true },
		{ id: 'actions', label: 'Akce', visible: true }
	];

	// Pagination options
	const pageSizeOptions = [5, 10, 20, 50];
	let currentPageSize = pagination.itemsPerPage;

	// Search and filter states
	let searchInput = filters.search;
	let dateFilter = filters.date;
	let activeFilter = filters.active;

	// Handlers
	function handleSearch() {
		updateUrlAndRefresh({
			search: searchInput,
			date: dateFilter,
			active: activeFilter,
			page: "1"
		});
	}

	function clearFilters() {
		searchInput = "";
		dateFilter = "";
		activeFilter = "";
		handleSearch();
	}

	function handlePageSizeChange() {
		updateUrlAndRefresh({
			pageSize: currentPageSize.toString(),
			page: "1"
		});
	}

	$: startIndex = ((pagination?.page || 1) - 1) * (pagination?.itemsPerPage || 10) + 1;
	$: endIndex = Math.min(
		(pagination?.page || 1) * (pagination?.itemsPerPage || 10),
		pagination?.totalItems || 0
	);
	$: totalCount = pagination?.totalItems || 0;

	function handlePageChange(newPage: number) {
		if (newPage < 1 || newPage > pagination.totalPages) return;
		updateUrlAndRefresh({ page: newPage.toString() });
	}

	function updateUrlAndRefresh(params: Record<string, string>) {
		const url = new URL(window.location.href);
		Object.entries(params).forEach(([key, value]) => {
			if (value) {
				url.searchParams.set(key, value);
			} else {
				url.searchParams.delete(key);
			}
		});
		goto(url.toString());
	}

	async function handleEdit(menuId: string) {
		try {
			await goto($ROUTES.ADMIN.MENU.EDIT(menuId));
		} catch (error) {
			console.error('Error navigating to edit page:', error);
		}
	}

	function getStatusClass(menu: Menu): string {
		if (!menu.active) {
			return 'text-red-600';
		}
		if (menu.currentVersion?.changes?.modified?.length) {
			return 'text-yellow-600';
		}
		return 'text-green-600';
	}
</script>

<div class="relative p-5 overflow-x-auto shadow-md sm:rounded-lg">
	<!-- Header -->
	<div class="flex justify-between mb-6">
		<h1 class="text-2xl font-bold">Seznam menu</h1>
		<button
			on:click={() => goto($ROUTES.ADMIN.MENU.NEW)}
			class="btn btn-primary">
			Nové menu
		</button>
	</div>

	<!-- Search and Controls -->
	<div class="flex flex-col gap-4 mb-6">
		<!-- Top Row with Pagination and Controls -->
		<div class="flex flex-wrap justify-between items-center gap-4 bg-base-200 p-4 rounded-lg">
			<!-- Left side - pagination info -->
			<div class="text-sm">
				Zobrazeno {startIndex} až {endIndex} z {totalCount} záznamů
			</div>

			<!-- Right side - pagination controls -->
			<div class="join">
				<button class="join-item btn btn-sm" disabled={pagination.page === 1}
								on:click={() => handlePageChange(1)}>«</button>
				<button class="join-item btn btn-sm" disabled={pagination.page === 1}
								on:click={() => handlePageChange(pagination.page - 1)}>‹</button>

				{#each Array(pagination.totalPages) as _, i}
					{#if i + 1 === 1 || i + 1 === pagination.totalPages ||
					(i + 1 >= pagination.page - 1 && i + 1 <= pagination.page + 1)}
						<button class="join-item btn btn-sm {pagination.page === i + 1 ? 'btn-active' : ''}"
										on:click={() => handlePageChange(i + 1)}>{i + 1}</button>
					{:else if i + 1 === pagination.page - 2 || i + 1 === pagination.page + 2}
						<button class="join-item btn btn-sm btn-disabled">...</button>
					{/if}
				{/each}

				<button class="join-item btn btn-sm"
								disabled={pagination.page === pagination.totalPages}
								on:click={() => handlePageChange(pagination.page + 1)}>›</button>
				<button class="join-item btn btn-sm"
								disabled={pagination.page === pagination.totalPages}
								on:click={() => handlePageChange(pagination.totalPages)}>»</button>
			</div>
		</div>

		<!-- Filters and Actions Row -->
		<div class="flex flex-wrap items-end gap-4 bg-base-200 p-4 rounded-lg">
			<!-- Search input -->
			<div class="form-control">
				<label class="label">Vyhledávání</label>
				<input type="text" placeholder="Hledat v menu..."
							 bind:value={searchInput}
							 class="input input-bordered w-full min-w-[200px]" />
			</div>

			<!-- Date filter -->
			<div class="form-control">
				<label class="label">Datum</label>
				<input type="date" bind:value={dateFilter}
							 class="input input-bordered w-full min-w-[200px]" />
			</div>

			<!-- Status filter -->
			<div class="form-control">
				<label class="label">Stav</label>
				<select bind:value={activeFilter}
								class="select select-bordered w-full min-w-[200px]">
					<option value="">Všechny stavy</option>
					<option value="true">Aktivní</option>
					<option value="false">Neaktivní</option>
				</select>
			</div>

			<!-- Action buttons -->
			<div class="join">
				<button class="join-item btn btn-primary" on:click={handleSearch}>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
							 viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
					</svg>
					Vyhledat
				</button>
				<button class="join-item btn" on:click={clearFilters}>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
							 viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
					</svg>
					Vyčistit
				</button>
			</div>

			<!-- Page size and columns -->
			<div class="join">
				<select bind:value={currentPageSize}
								on:change={handlePageSizeChange}
								class="join-item select select-bordered">
					{#each pageSizeOptions as size}
						<option value={size}>{size} na stránku</option>
					{/each}
				</select>

				<div class="dropdown dropdown-end join-item">
					<button class="btn">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
								 viewBox="0 0 20 20" fill="currentColor">
							<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
							<path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2-2h10v2H5V3zm0 4v8h10V7H5z" clip-rule="evenodd" />
						</svg>
						Sloupce
					</button>
					<ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
						{#each columns as column}
							<li>
								<label class="label cursor-pointer">
									<span>{column.label}</span>
									<input type="checkbox" bind:checked={column.visible}
												 class="checkbox" />
								</label>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>

	<!-- Table -->
	<div class="overflow-x-auto">
		<table class="w-full text-sm text-left text-gray-500">
			<thead class="text-xs text-gray-700 uppercase bg-gray-50">
				<tr>
					{#each columns as column}
						{#if column.visible}
							<th scope="col" class="px-6 py-3">
								{column.label}
							</th>
						{/if}
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each menus as menu (menu.id)}
					<tr class="bg-white border-b hover:bg-gray-50" transition:fade>
						{#if columns.find((c) => c.id === "date")?.visible}
							<td class="px-6 py-4">
								{formatVersionDate(menu.date)}
							</td>
						{/if}

						{#if columns.find((c) => c.id === "soup")?.visible}
							<td class="px-6 py-4">
								{menu.soup || "-"}
							</td>
						{/if}

						{#if columns.find((c) => c.id === "variants")?.visible}
							<td class="px-6 py-4">
								{menu.variants?.length || 0} variant(y)
							</td>
						{/if}

						{#if columns.find((c) => c.id === "status")?.visible}
							<td class="px-6 py-4">
								<span class={getStatusClass(menu)}>
									{menu.active ? "Aktivní" : "Neaktivní"}
								</span>
							</td>
						{/if}

						{#if columns.find((c) => c.id === "changes")?.visible}
							<td class="px-6 py-4">
								{#if menu.currentVersion?.changes}
									<div class="text-xs">
										{#if menu.currentVersion.changes.modified?.length}
											<span class="text-yellow-600">
												{menu.currentVersion.changes.modified.length} změn
											</span>
										{/if}
										{#if menu.currentVersion.changes.added?.length}
											<span class="text-green-600 ml-2">
												{menu.currentVersion.changes.added.length} nové
											</span>
										{/if}
									</div>
								{/if}
							</td>
						{/if}

						{#if columns.find((c) => c.id === "actions")?.visible}
							<td class="px-6 py-4">
								<button
									on:click={() => handleEdit(menu.id)}
									class="font-medium text-blue-600 hover:underline">
									Upravit
								</button>
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
		{#if menus.length === 0}
			<div class="text-center py-8 text-gray-500">Žádná menu k zobrazení</div>
		{/if}
	</div>
</div>
<style>
	/* Additional styles if needed */
	:global(.table-container) {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}
</style>
