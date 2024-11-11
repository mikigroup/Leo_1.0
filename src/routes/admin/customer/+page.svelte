<script lang="ts">
	import { goto } from "$app/navigation";
	import { writable } from "svelte/store";
	import { createSvelteTable, getCoreRowModel } from "@tanstack/svelte-table";
	import type { TableOptions } from "@tanstack/svelte-table";
	import { BarLoader } from "svelte-loading-spinners";
	import { navigating } from "$app/stores";
	import { fade, fly } from "svelte/transition";
	import { ROUTES } from "$lib/stores/store";

	export let data;
	let {
		supabase,
		session,
		customers,
		profileTableSettings,
		currentPage,
		totalPages,
		totalItems,
		itemsOnCurrentPage,
		searchQuery,
		pagination
	} = data;
	$: ({
		supabase,
		session,
		customers,
		profileTableSettings,
		currentPage,
		totalPages,
		totalItems,
		itemsOnCurrentPage,
		searchQuery,
		pagination
	} = data);

	// State variables
	let loading = false;
	let searchInput = searchQuery;
	let transitionKey: number = 0;

	// Column definitions
	const columnNames: Record<string, string> = {
		created_at: "Registrace",
		first_name: "Jméno",
		last_name: "Příjmení",
		email: "E-mail",
		telephone: "Telefon",
		street: "Ulice",
		city: "Město",
		street_number: "Číslo popisné",
		zip_code: "PSČ"
	};

	const columnOrder: string[] = Object.keys(columnNames);
	const pageSizeOptions = [5, 10, 20, 50];
	let currentPageSize = pagination.itemsPerPage;

	// Visible columns management
	let visibleColumns: Record<string, boolean> =
		profileTableSettings?.table_settings_customers ??
		columnOrder.reduce((obj, column) => {
			obj[column] = true;
			return obj;
		}, {});

	const visibleColumnsStore = writable<Record<string, boolean>>(visibleColumns);

	// Column visibility toggle
	function toggleColumn(column: string) {
		visibleColumnsStore.update((cols) => {
			const newCols = { ...cols, [column]: !cols[column] };
			return columnOrder.reduce((obj, col) => {
				obj[col] = newCols[col] ?? true;
				return obj;
			}, {});
		});
	}

	// Save table settings to DB profile setting of logged in user
	async function saveTableSettings() {
		if (session?.user.id == undefined) {
			console.error("Uživatel není přihlášen");
			return;
		}

		const { data, error } = await supabase
			.from("profiles")
			.update({ table_settings_customers: $visibleColumnsStore })
			.eq("id", session.user.id);

		if (error) {
			console.error("Chyba při ukládání nastavení filtrů:", error);
		}
	}

	// Subscribe to changes and save settings
	visibleColumnsStore.subscribe(saveTableSettings);

	// Filter customers based on search
	$: filteredCustomers = customers?.filter((customer) =>
		Object.values(customer).some((value) =>
			value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	// Define table columns
	$: columns = columnOrder
		.filter((key) => $visibleColumnsStore[key])
		.map((key) => ({
			accessorKey: key,
			header: columnNames[key],
			cell: ({ getValue }) => {
				if (key === "created_at") {
					return formatDateToCzech(getValue<string>());
				}
				return getValue<string>();
			}
		}));

	// Create table options
	$: options = writable<TableOptions<(typeof customers)[0]>>({
		data: filteredCustomers,
		columns,
		getCoreRowModel: getCoreRowModel()
	});

	$: visibleColumnsStore.subscribe((value) => {
		options.update((options) => ({
			...options,
			columns: columns.filter((column) => value[column.accessorKey])
		}));
	});

	// Create table instance
	$: table = createSvelteTable(options);

	// Helper function: Format date to Czech format
	function formatDateToCzech(date: string) {
		if (!date) return "";
		const dateObj = new Date(date);
		const day = dateObj.getDate().toString().padStart(2, "0");
		const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
		const year = dateObj.getFullYear();
		const hours = dateObj.getHours().toString().padStart(2, "0");
		const minutes = dateObj.getMinutes().toString().padStart(2, "0");
		return `${day}.${month}.${year} ${hours}:${minutes}`;
	}

	function handlePageChange(newPage: number) {
		if (newPage < 1 || newPage > pagination.totalPages) return;
		updateUrlAndRefresh({ page: newPage.toString() });
	}

	function handlePageSizeChange() {
		updateUrlAndRefresh({
			pageSize: currentPageSize.toString(),
			page: "1"
		});
	}

	function handleSearch() {
		loading = true;
		try {
			updateUrlAndRefresh({
				search: searchInput,
				page: "1"
			});
		} catch (error) {
			console.error("Chyba při vyhledávání:", error);
		} finally {
			loading = false;
		}
	}

	function clearFilters() {
		searchInput = "";
		handleSearch();
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

	$: startIndex = ((pagination?.page || 1) - 1) * (pagination?.itemsPerPage || 10) + 1;
	$: endIndex = Math.min(
		(pagination?.page || 1) * (pagination?.itemsPerPage || 10),
		pagination?.totalItems || 0
	);
	$: totalCount = pagination?.totalItems || 0;
</script>

<svelte:head>
	<title>LEO - Zákazníci</title>
</svelte:head>

<div class="p-4">
	<!-- Header -->
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-2xl font-bold">Seznam zákazníků</h1>
	</div>

	<!-- Filters Card -->
	<div class="card shadow-xl mb-6 bg-gray-300">
		<div class="card-body">
			<!-- Search and Filters -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
				<div class="form-control">
					<label class="label">Vyhledávání</label>
					<input
						type="text"
						bind:value={searchInput}
						placeholder="Hledat zákazníka..."
						class="input input-bordered"
					/>
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
					<select
						bind:value={currentPageSize}
						on:change={handlePageSizeChange}
						class="select select-bordered join-item">
						{#each pageSizeOptions as size}
							<option value={size}>{size} na stránku</option>
						{/each}
					</select>

					<div class="dropdown dropdown-end">
						<button tabindex="0" class="btn join-item">Sloupce</button>
						<ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
							{#each columnOrder as column}
								<li>
									<label class="label cursor-pointer">
										<span class="label-text">{columnNames[column]}</span>
										<input
											type="checkbox"
											class="checkbox"
											checked={$visibleColumnsStore[column]}
											on:change={() => toggleColumn(column)}
										/>
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
			<button
				class="join-item btn w-20"
				disabled={pagination.page === 1}
				on:click={() => handlePageChange(1)}>«</button>

			<button
				class="join-item btn w-24"
				disabled={pagination.page === 1}
				on:click={() => handlePageChange(pagination.page - 1)}>‹</button>

			{#each Array(pagination.totalPages) as _, i}
				{#if i + 1 === 1 || i + 1 === pagination.totalPages ||
				(i + 1 >= pagination.page - 1 && i + 1 <= pagination.page + 1)}
					<button
						class="join-item btn"
						class:btn-active={pagination.page === i + 1}
						on:click={() => handlePageChange(i + 1)}>{i + 1}</button>
				{:else if i + 1 === pagination.page - 2 || i + 1 === pagination.page + 2}
					<button class="join-item btn btn-disabled">...</button>
				{/if}
			{/each}

			<button
				class="join-item btn w-24"
				disabled={pagination.page === pagination.totalPages}
				on:click={() => handlePageChange(pagination.page + 1)}>›</button>

			<button
				class="join-item btn w-20"
				disabled={pagination.page === pagination.totalPages}
				on:click={() => handlePageChange(pagination.totalPages)}>»</button>
		</div>
	</div>

	<!-- Table -->
	<div class="card shadow-xl overflow-x-auto bg-gray-200">
		{#key transitionKey}
			<div class="card-body p-0" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
				{#if $navigating || loading}
					<div class="flex justify-center py-8">
						<BarLoader size="120" color="black" unit="px" duration="1s" />
					</div>
				{:else if filteredCustomers && filteredCustomers.length > 0}
					{#each $table.getRowModel().rows as row, index}
						<div
							in:fly={{ y: 50, duration: 300, delay: index * 50 }}
							class="w-full gap-4 p-2 px-5 my-1 border border-gray-300 md:flex rounded-xl hover:bg-cyan-700 hover:text-white row {index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}">
							{#each row.getVisibleCells() as cell}
								<div
									class="w-full truncate-cell flex items-center {cell.column.id === 'email' ? 'md:w-1/3' : 'md:w-1/6 lg:w-1/6 xl:w-1/6'}"
									title={cell.getValue() ?? ""}>
									{#if cell.column.id === "created_at"}
										{formatDateToCzech(cell.getValue())}
									{:else}
										{cell.getValue() ?? ""}
									{/if}
								</div>
							{/each}
							<div class="w-full md:w-1/6 lg:w-1/6 xl:w-1/6 flex items-center justify-end">
								<a>
								href={$ROUTES.ADMIN.CUSTOMER.EDIT(row.original.id)}
								class="btn btn-ghost btn-xs">
								upravit
								</a>
							</div>
						</div>
					{/each}
				{:else}
					<div class="text-center py-8 text-base-content/60">
						Žádní zákazníci k zobrazení
					</div>
				{/if}
			</div>
		{/key}
	</div>
</div>

<style>
    .truncate-cell {
        max-width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
