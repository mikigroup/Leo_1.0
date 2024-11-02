import eslintPluginSvelte from "eslint-plugin-svelte";
import typescriptParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import prettierConfig from "eslint-config-prettier";
import svelteParser from "svelte-eslint-parser";

export default [
	{
		files: ["**/*.{js,ts,svelte}"],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				sourceType: "module",
				ecmaVersion: 2020,
				extraFileExtensions: [".svelte"]
			}
		},
		plugins: {
			"@typescript-eslint": typescriptPlugin
		}
	},
	...eslintPluginSvelte.configs["flat/recommended"],
	{
		files: ["**/*.svelte"],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: typescriptParser
			}
		}
	},
	prettierConfig
];