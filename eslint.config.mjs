import { defineConfig } from "eslint/config";
import eslintPlugin from "@eslint/js";
import pluginCypress from "eslint-plugin-cypress";
import { configs as tseslintConfigs } from "typescript-eslint";

// Global ignores configuration
// Must be in its own config object to act as global ignores
const ignoresConfig = defineConfig([
  {
    name: "project/ignores",
    ignores: [
      ".next/",
      "node_modules/",
      "public/",
      ".vscode/",
      "next-env.d.ts",
    ],
  },
]);

// ESLint recommended rules for JavaScript/TypeScript
const eslintConfig = defineConfig([
  {
    name: "project/javascript-recommended",
    files: ["**/*.{js,mjs,ts,tsx}"],
    ...eslintPlugin.configs.recommended,
  },
]);

// TypeScript configuration with type-checked rules
const typescriptConfig = defineConfig([
  {
    name: "project/typescript-strict",
    files: ["**/*.{ts,tsx,mjs}"],
    extends: [
      ...tseslintConfigs.strictTypeChecked,
      ...tseslintConfigs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        // Automatically detects tsconfig.json
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
        warnOnUnsupportedTypeScriptVersion: true,
      },
    },
    rules: {
      // Disable rules that conflict with TypeScript's own error checking
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/triple-slash-reference": "off",
      // disabled next rule due to bug:
      // https://github.com/typescript-eslint/typescript-eslint/issues/11732
      // https://github.com/eslint/eslint/issues/20272
      "@typescript-eslint/unified-signatures": "off",
      // Allow ts-expect-error and ts-ignore with descriptions
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": "allow-with-description",
          "ts-nocheck": false,
          "ts-check": false,
          minimumDescriptionLength: 3,
        },
      ],
    },
  },
  {
    name: "project/javascript-disable-type-check",
    files: ["**/*.{js,mjs,cjs}"],
    ...tseslintConfigs.disableTypeChecked,
  },
]);

const cypressConfig = defineConfig([
  {
    files: ["cypress/**/*.js"],
    extends: [pluginCypress.configs.recommended],
  },
]);

// Export the complete configuration
// Order matters: ignores first, then general configs, then specific overrides
export default defineConfig([
  ...ignoresConfig,
  ...eslintConfig,
  ...typescriptConfig,
  ...cypressConfig,
]);
