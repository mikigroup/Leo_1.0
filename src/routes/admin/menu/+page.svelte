<script lang="ts">
	import { goto } from "$app/navigation";
	import { writable } from "svelte/store";
	import {
		createSvelteTable,
		flexRender,
		getCoreRowModel
	} from "@tanstack/svelte-table";
	import type { ColumnDef, TableOptions } from "@tanstack/svelte-table";
	import { ROUTES } from "$lib/stores/store";
	import { formatVersionDate } from "$lib/utils/menuVersioning";

	export let data;

	let {
		session,
		supabase,
		menus,
		profileTableSettings,
		currentPage,
		totalPages,
		totalItems,
		itemsOnCurrentPage,
		itemsPerPage
	} = data;
	$: ({
		session,
		supabase,
		menus,
		profileTableSettings,
		currentPage,
		totalPages,
		totalItems,
		itemsOnCurrentPage,
		itemsPerPage
	} = data);

	let loading = false;
	let filterDate = "";
	let filterActive = "";
	let searchQuery = "";
	let searchInput = searchQuery;

	function newMenuPage() {
		goto($ROUTES.ADMIN.MENU.NEW);
	}

	function formatDateToCzech(date: any) {
		if (!date) return "";
		const parts = date.split("-");
		if (parts.length !== 3) {
			return date;
		}
		const [year, month, day] = parts;
		return `${day}.${month}.${year}`;
	}

	const columnNames = {
		date: "Datum",
		soup: "Polévka",
		variants: "Varianty",
		active: "Aktivní",
		notes: "Poznámky",
		type: "Typ",
		nutri: "Nutriční informace"
	};

	const columnOrder = Object.keys(columnNames);

	let visibleColumns =
		profileTableSettings?.table_settings_menus ??
		columnOrder.reduce((obj, column) => {
			obj[column] = true;
			return obj;
		}, {});

	const visibleColumnsStore = writable(visibleColumns);

	function toggleColumn(column) {
		visibleColumnsStore.update((cols) => ({
			...cols,
			[column]: !cols[column]
		}));
	}

	async function saveTableSettings() {
		if (session?.user.id == undefined) {
			console.error("Uživatel není přihlášen");
			return;
		}

		const updatedSettings = columnOrder.reduce((obj, column) => {
			obj[column] = $visibleColumnsStore[column];
			return obj;
		}, {});

		const orderedSettings = columnOrder.reduce((obj, column) => {
			obj[column] = updatedSettings[column];
			return obj;
		}, {});

		const { data, error } = await supabase
			.from("profiles")
			.update({ table_settings_menus: orderedSettings })
			.eq("id", session.user.id);

		if (error) {
			console.error("Chyba při ukládání nastavení filtrů:", error);
		}
	}

	visibleColumnsStore.subscribe(saveTableSettings);

	// Vylepšená funkce pro filtrování menu
	$: filteredMenus = menus?.filter((menu) => {
		const matchesSearch = Object.values(menu).some((value) =>
			value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
		);

		const matchesDate = !filterDate || menu.date === filterDate;

		const matchesActive = !filterActive || menu.active.toString() === filterActive;

		return matchesSearch && matchesDate && matchesActive;
	});

	$: columns = columnOrder
		.filter((key) => $visibleColumnsStore[key])
		.map((key) => ({
			accessorKey: key,
			header: columnNames[key],
			cell: ({ getValue }) => {
				if (key === "date") {
					return formatDateToCzech(getValue());
				} else if (key === "active") {
					return getValue() ? "Ano" : "Ne";
				}
				return getValue();
			}
		}));

	$: options = writable<TableOptions<(typeof menus)[0]>>({
		data: filteredMenus,
		columns,
		getCoreRowModel: getCoreRowModel()
	});

	$: visibleColumnsStore.subscribe((value) => {
		options.update((options) => ({
			...options,
			columns: columns.filter((column) => value[column.accessorKey])
		}));
	});

	$: table = createSvelteTable(options);

	function previousPage() {
		if (currentPage > 1) {
			goto(`?page=${currentPage - 1}`);
		}
	}

	function nextPage() {
		if (currentPage < totalPages) {
			goto(`?page=${currentPage + 1}`);
		}
	}

	// Upravená funkce pro vyhledávání, která zahrnuje i datum a stav aktivity
	async function handleSearch() {
		loading = true;
		try {
			const searchParams = new URLSearchParams();

			if (searchInput) {
				searchParams.set('search', searchInput);
			}
			if (filterDate) {
				searchParams.set('date', filterDate);
			}
			if (filterActive) {
				searchParams.set('active', filterActive);
			}
			searchParams.set('page', '1');

			await goto(`?${searchParams.toString()}`);
		} catch (error) {
			console.error("Chyba při vyhledávání:", error);
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>LEO - Menu</title>
</svelte:head>

<section>
	<div class="flex justify-between">
		<div class="flex flex-col gap-2 md:flex-row">
			<div>
				<button on:click={newMenuPage} class="btn btn-outline">
					Vytvořit menu
				</button>
			</div>
			<div>
				<input type="date" bind:value={filterDate} class="btn btn-outline" />
			</div>
			<div>
				<select
					bind:value={filterActive}
					class="select select-bordered w-full max-w-xs border-black">
					<option value="">Všechny aktivity</option>
					<option value="true">Aktivní</option>
					<option value="false">Neaktivní</option>
				</select>
			</div>
			<div class="flex gap-2">
				<input
					type="text"
					placeholder="Hledat..."
					class="input input-bordered input-md w-full max-w-xs border-black"
					bind:value={searchInput} />
				<button
					class="btn btn-outline"
					on:click={handleSearch}
					disabled={loading}>
					{loading ? "Vyhledávám..." : "Vyhledat"}
				</button>
			</div>
		</div>
	</div>
</section>

<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

<section>
	<div class="join grid grid-cols-2 w-1/2 mx-auto my-10">
		<button
			class="join-item btn btn-outline"
			on:click={previousPage}
			disabled={currentPage === 1}>
			Předchozí stránka
		</button>
		<button
			class="join-item btn btn-outline"
			on:click={nextPage}
			disabled={currentPage === totalPages}>
			Další stránka
		</button>
	</div>

	<div class="flex flex-col md:flex-row justify-between items-center w-full my-4">
		<p>Celkový počet menu: {totalItems}</p>
		<p>Stránka {currentPage} z {totalPages}</p>
		<p>Zobrazeno {itemsOnCurrentPage} z {totalItems} menu</p>
	</div>
</section>

<section>
	<div class="flex justify-end dropdown">
		<button class="btn btn-outline" tabindex="0">Sloupce</button>
		<ul
			tabindex="0"
			class="p-2 shadow dropdown-content menu bg-base-100 rounded-box w-52">
			{#each Object.keys(visibleColumns) as column}
				<li>
					<label>
						<input
							type="checkbox"
							checked={$visibleColumnsStore[column]}
							on:change={() => toggleColumn(column)} />
						{columnNames[column]}
					</label>
				</li>
			{/each}
		</ul>
	</div>
</section>

<section>
	<div class="flex flex-wrap">
		<div class="hidden w-full gap-4 p-2 px-5 my-2 border border-gray-300 md:flex rounded-xl bg-gray-400">
			{#each columnOrder.filter((col) => $visibleColumnsStore[col]) as column, index}
				<div class="w-full {column === 'variants' || column === 'soup' ? 'md:w-1/4' : 'md:w-1/6 lg:w-1/6 xl:w-1/6'} {index < columnOrder.filter((col) => $visibleColumnsStore[col]).length - 1 ? 'border-r-2' : ''}">
					{columnNames[column]}
				</div>
			{/each}
			<div class="flex justify-end w-full md:w-1/6 lg:w-1/6 xl:w-1/6">
				Editovat
			</div>
		</div>

		{#if filteredMenus && filteredMenus.length > 0}
			{#each $table.getRowModel().rows as row, index}
				<div class="w-full gap-4 p-2 px-5 my-1 border border-gray-300 md:flex rounded-xl hover:bg-cyan-700 hover:text-white row {index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}">
					{#each row.getVisibleCells() as cell}
						<div class="w-full {cell.column.id === 'variants' || cell.column.id === 'soup' ? 'md:w-1/4' : 'md:w-1/6 lg:w-1/6 xl:w-1/6'} flex items-center">
							{#if cell.column.id === "variants"}
								{#if Array.isArray(cell.getValue()) && cell.getValue().length > 0}
									<div class="pl-4">
										{#each cell.getValue().sort((a, b) => a.variant_number - b.variant_number) as variant}
											<div class="mb-1">
												<span class="font-medium">{variant.variant_number}.</span>
												{variant.description}
											</div>
										{/each}
									</div>
								{:else}
									<span class="text-gray-400">Žádné varianty</span>
								{/if}
							{:else if cell.column.id === "active"}
								{cell.getValue() ? "Ano" : "Ne"}
							{:else if cell.column.id === "date"}
								{formatDateToCzech(cell.getValue())}
							{:else}
								{cell.getValue() ?? ""}
							{/if}
						</div>
					{/each}
					<div class="w-full md:w-1/6 lg:w-1/6 xl:w-1/6 flex items-center justify-end">
						<a
							href="/admin/menu/{row.original.id}"
							data-sveltekit-preload-data
							class="font-medium hover:underline">
							Upravit
						</a>
					</div>
				</div>
			{/each}
		{:else}
			<p>Žádná menu</p>
		{/if}
	</div>
</section>