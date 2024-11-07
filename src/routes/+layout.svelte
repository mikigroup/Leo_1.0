<script lang="ts">
	import "./app.css";
	import "./banner.css";
	import { page } from "$app/stores";
	import GDPR from "$lib/gdpr/Gdpr.svelte";
	import { invalidate } from "$app/navigation";
	import { onMount } from "svelte";
	import HeaderAdmin from "$lib/component/HeaderAdmin.svelte";
	import HeaderCustomer from "$lib/component/HeaderCustomer.svelte";
	import Footer from "$lib/component/Footer.svelte";
	import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
	import { ROUTES } from "$lib/stores/store";

	export let data;
	let { supabase, session, user } = data;
	$: ({ supabase, session, user } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate("supabase:auth");
			}
		});
		return () => data.subscription.unsubscribe();
	});
	$: isAdminRoute = $page.url.pathname.startsWith($ROUTES.ADMIN.BASE);
	injectSpeedInsights();
</script>

<!-- <Header /> -->
{#if !isAdminRoute}
	<HeaderCustomer {data} />
{:else}
	<HeaderAdmin {data} />
{/if}

{#if !isAdminRoute}
	<div class="pt-5 mt-20" />
{:else}
	<div class="" />
{/if}

<main>
	<slot class="mt-10 container mx-auto" />
</main>

<!--<GDPR cookieName="gdpr" />   NUTNO ZAPNOUT PRI OSTREM PROVOZU-->
<!-- <GdprBanner bind:this={gdprBanner} cookieName="props.beyonk_gdpr" {...props} on:analytics={initAnalytics} /> -->

<Footer />

<style lang="scss">

</style>
