import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({
																						 locals: { supabase, session },
																						 url
																					 }) => {
	try {
		// Get pagination and filter parameters from URL
		const page = parseInt(url.searchParams.get("page") || "1");
		const itemsPerPage = parseInt(url.searchParams.get("pageSize") || "20");
		const searchQuery = url.searchParams.get("search") || "";

		const from = (page - 1) * itemsPerPage;
		const to = from + itemsPerPage - 1;

		// Build base query
		let query = supabase
			.from("customers")
			.select("*", { count: "exact" })
			.order("created_at", { ascending: false });

		// Add search filter if search query exists
		if (searchQuery) {
			const searchConditions = [
				"first_name",
				"last_name",
				"email",
				"telephone",
				"street",
				"city",
				"zip_code"
			].map(field => `${field}.ilike.%${searchQuery}%`);

			query = query.or(searchConditions.join(","));
		}

		// Execute query with range
		const { data: customers, error: customersError, count } = await query
			.range(from, to);

		if (customersError) {
			console.error("Error fetching customers:", customersError);
			throw error(500, "Failed to load customers");
		}

		// Get profile table settings
		const { data: profileTableSettings, error: profileError } = await supabase
			.from("profiles")
			.select("table_settings_customers")
			.eq("id", session?.user?.id)
			.single();

		if (profileError && profileError.code !== "PGRST116") {
			console.error("Error fetching profile:", profileError);
			throw error(500, "Failed to load profile settings");
		}

		return {
			customers,
			profileTableSettings,
			pagination: {
				page,
				totalPages: Math.ceil((count || 0) / itemsPerPage),
				totalItems: count,
				itemsPerPage
			},
			searchQuery
		};

	} catch (err) {
		console.error("Unexpected error in load function:", err);
		throw error(500, "An unexpected error occurred");
	}
};