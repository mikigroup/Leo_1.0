<script lang="ts">
	import { goto } from "$app/navigation";
	import { fade } from "svelte/transition";
	import type { Menu } from "$lib/types/menu";
	import { formatVersionDate } from "$lib/utils/menuVersioning";
	import { ROUTES } from "$lib/stores/store";

	export let data;
	let { menus, pagination, filters } = data;
	$: ({ menus, pagination, filters } = data);

	interface Pagination {
		page: number;
		totalPages: number;
		totalItems: number | null;
		itemsPerPage: number;
	}

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

	const pageSizeOptions = [5, 10, 20, 50];
	let currentPageSize = pagination.itemsPerPage;
	let searchInput = filters.search;
	let dateFilter = filters.date;
	let activeFilter = filters.active;

	// Handlers
	const handleSearch = () => updateUrlAndRefresh({
		search: searchInput,
		date: dateFilter,
		active: activeFilter,
		page: "1"
	});

	const clearFilters = () => {
		searchInput = dateFilter = activeFilter = "";
		handleSearch();
	};

	const handlePageSizeChange = () => updateUrlAndRefresh({
		pageSize: currentPageSize.toString(),
		page: "1"
	});

	$: startIndex = ((pagination?.page || 1) - 1) * (pagination?.itemsPerPage || 10) + 1;
	$: endIndex = Math.min(
		(pagination?.page || 1) * (pagination?.itemsPerPage || 10),
		pagination?.totalItems || 0
	);
	$: totalCount = pagination?.totalItems || 0;

	const handlePageChange = (newPage: number) => {
		if (newPage < 1 || newPage > pagination.totalPages) return;
		updateUrlAndRefresh({ page: newPage.toString() });
	};

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

	function getStatusClass(menu: Menu): string {
		if (!menu.active) return 'text-error';
		if (menu.currentVersion?.changes?.modified?.length) return 'text-warning';
		return 'text-success';
	}
</script>

<div class="p-4">
	<!-- Header -->
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-2xl font-bold">Seznam menu</h1>
		<a href={$ROUTES.ADMIN.MENU.NEW} class="btn btn-outline">Nové menu</a>
	</div>

	<!-- Filters Card -->
	<div class="card bg-base-100 shadow-xl mb-6">
		<div class="card-body">
			<!-- Search and Filters -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
				<div class="form-control">
					<label class="label">Vyhledávání</label>
					<input type="text" bind:value={searchInput}
								 placeholder="Hledat v menu..."
								 class="input input-bordered" />
				</div>

				<div class="form-control">
					<label class="label">Datum</label>
					<input type="date" bind:value={dateFilter}
								 class="input input-bordered" />
				</div>

				<div class="form-control">
					<label class="label">Stav</label>
					<select bind:value={activeFilter} class="select select-bordered">
						<option value="">Všechny stavy</option>
						<option value="true">Aktivní</option>
						<option value="false">Neaktivní</option>
					</select>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex flex-wrap justify-between items-center gap-4">
				<div class="join">
					<button class="btn btn-outline join-item" on:click={handleSearch}>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
						Vyhledat
					</button>
					<button class="btn btn-outline join-item" on:click={clearFilters}>Vyčistit</button>
				</div>

				<div class="join">
					<select bind:value={currentPageSize}
									on:change={handlePageSizeChange}
									class="select select-bordered join-item">
						{#each pageSizeOptions as size}
							<option value={size}>{size} na stránku</option>
						{/each}
					</select>

					<div class="dropdown dropdown-end">
						<button tabindex="0" class="btn join-item">Sloupce</button>
						<ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
							{#each columns as column}
								<li>
									<label class="label cursor-pointer">
										<span class="label-text">{column.label}</span>
										<input type="checkbox" class="checkbox" bind:checked={column.visible} />
									</label>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Pagination -->
	<div class="flex justify-center mt-4">
		<div class="join">
			<button class="join-item btn"
							disabled={pagination.page === 1}
							on:click={() => handlePageChange(1)}>«</button>

			<button class="join-item btn"
							disabled={pagination.page === 1}
							on:click={() => handlePageChange(pagination.page - 1)}>‹</button>

			{#each Array(pagination.totalPages) as _, i}
				{#if i + 1 === 1 || i + 1 === pagination.totalPages ||
				(i + 1 >= pagination.page - 1 && i + 1 <= pagination.page + 1)}
					<button class="join-item btn"
									class:btn-active={pagination.page === i + 1}
									on:click={() => handlePageChange(i + 1)}>{i + 1}</button>
				{:else if i + 1 === pagination.page - 2 || i + 1 === pagination.page + 2}
					<button class="join-item btn btn-disabled">...</button>
				{/if}
			{/each}

			<button class="join-item btn"
							disabled={pagination.page === pagination.totalPages}
							on:click={() => handlePageChange(pagination.page + 1)}>›</button>

			<button class="join-item btn"
							disabled={pagination.page === pagination.totalPages}
							on:click={() => handlePageChange(pagination.totalPages)}>»</button>
		</div>
	</div>


	<!-- Table -->
	<div class="card bg-base-100 shadow-xl overflow-x-auto">
		<div class="card-body p-0">
			<table class="table table-zebra">
				<thead>
				<tr>
					{#each columns as column}
						{#if column.visible}
							<th>{column.label}</th>
						{/if}
					{/each}
				</tr>
				</thead>
				<tbody>
				{#each menus as menu (menu.id)}
					<tr class="hover" transition:fade>
						{#if columns.find(c => c.id === 'date')?.visible}
							<td>{formatVersionDate(menu.date)}</td>
						{/if}
						{#if columns.find(c => c.id === 'soup')?.visible}
							<td>{menu.soup || '-'}</td>
						{/if}
						{#if columns.find(c => c.id === 'variants')?.visible}
							<td>{menu.variants?.length || 0} variant(y)</td>
						{/if}
						{#if columns.find(c => c.id === 'status')?.visible}
							<td>
								<div class="badge" class:text-green-500={menu.active} class:text-red-500={!menu.active}>
									{menu.active ? 'Aktivní' : 'Neaktivní'}
								</div>
							</td>
						{/if}
						{#if columns.find(c => c.id === 'changes')?.visible}
							<td>
								{#if menu.currentVersion?.changes}
									<div class="space-x-2">
										{#if menu.currentVersion.changes.modified?.length}
												<span class="badge badge-warning">
													{menu.currentVersion.changes.modified.length} změn
												</span>
										{/if}
										{#if menu.currentVersion.changes.added?.length}
												<span class="badge badge-success">
													{menu.currentVersion.changes.added.length} nové
												</span>
										{/if}
									</div>
								{/if}
							</td>
						{/if}
						{#if columns.find(c => c.id === 'actions')?.visible}
							<td>
								<a href={$ROUTES.ADMIN.MENU.EDIT(menu.id)} class="btn btn-ghost btn-xs">
									upravit
								</a>
							</td>
						{/if}
					</tr>
				{/each}
				</tbody>
			</table>
			{#if menus.length === 0}
				<div class="text-center py-8 text-base-content/60">
					Žádná menu k zobrazení
				</div>
			{/if}
		</div>
	</div>


</div>