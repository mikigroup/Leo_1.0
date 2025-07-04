// vite.config.ts
import { sentrySvelteKit } from "file:///C:/Users/jiri-stolni/Documents/GitHub/Stastne-srdce/node_modules/@sentry/sveltekit/build/cjs/index.server.js";
import { defineConfig } from "file:///C:/Users/jiri-stolni/Documents/GitHub/Stastne-srdce/node_modules/vite/dist/node/index.js";
import "file:///C:/Users/jiri-stolni/Documents/GitHub/Stastne-srdce/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import { sveltekit } from "file:///C:/Users/jiri-stolni/Documents/GitHub/Stastne-srdce/node_modules/@sveltejs/kit/src/exports/vite/index.js";
var vite_config_default = defineConfig({
  plugins: [
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: "stastnesrdce",
        project: "javascript-svelte",
        authToken: process.env.SENTRY_AUTH_TOKEN
      }
    }),
    sveltekit()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxqaXJpLXN0b2xuaVxcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXFN0YXN0bmUtc3JkY2VcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGppcmktc3RvbG5pXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxcU3Rhc3RuZS1zcmRjZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvamlyaS1zdG9sbmkvRG9jdW1lbnRzL0dpdEh1Yi9TdGFzdG5lLXNyZGNlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgc2VudHJ5U3ZlbHRlS2l0IH0gZnJvbSBcIkBzZW50cnkvc3ZlbHRla2l0XCI7XHJcbi8qIGltcG9ydCB7IHN2ZWx0ZWtpdCB9IGZyb20gJ0BzdmVsdGVqcy9raXQvdml0ZSc7XHJcbmltcG9ydCB0eXBlIHsgVXNlckNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5cclxuY29uc3QgY29uZmlnOiBVc2VyQ29uZmlnID0ge1xyXG5cdHBsdWdpbnM6IFtzdmVsdGVraXQoKV1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcclxuICovXHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgeyBzdmVsdGUgfSBmcm9tIFwiQHN2ZWx0ZWpzL3ZpdGUtcGx1Z2luLXN2ZWx0ZVwiO1xyXG5pbXBvcnQgeyBzdmVsdGVraXQgfSBmcm9tIFwiQHN2ZWx0ZWpzL2tpdC92aXRlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG5cdHBsdWdpbnM6IFtcclxuXHRcdHNlbnRyeVN2ZWx0ZUtpdCh7XHJcblx0XHRcdHNvdXJjZU1hcHNVcGxvYWRPcHRpb25zOiB7XHJcblx0XHRcdFx0b3JnOiBcInN0YXN0bmVzcmRjZVwiLFxyXG5cdFx0XHRcdHByb2plY3Q6IFwiamF2YXNjcmlwdC1zdmVsdGVcIixcclxuXHRcdFx0XHRhdXRoVG9rZW46IHByb2Nlc3MuZW52LlNFTlRSWV9BVVRIX1RPS0VOXHJcblx0XHRcdH1cclxuXHRcdH0pLFxyXG5cdFx0c3ZlbHRla2l0KClcclxuXHRdXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVWLFNBQVMsdUJBQXVCO0FBV3ZYLFNBQVMsb0JBQW9CO0FBQzdCLE9BQXVCO0FBQ3ZCLFNBQVMsaUJBQWlCO0FBRTFCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzNCLFNBQVM7QUFBQSxJQUNSLGdCQUFnQjtBQUFBLE1BQ2YseUJBQXlCO0FBQUEsUUFDeEIsS0FBSztBQUFBLFFBQ0wsU0FBUztBQUFBLFFBQ1QsV0FBVyxRQUFRLElBQUk7QUFBQSxNQUN4QjtBQUFBLElBQ0QsQ0FBQztBQUFBLElBQ0QsVUFBVTtBQUFBLEVBQ1g7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
