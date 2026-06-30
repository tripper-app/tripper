const tseslint = require("typescript-eslint");
const importPlugin = require("eslint-plugin-import");

// Flat config (ESLint 9+). Replaces the legacy .eslintrc.js while
// preserving the original rule set.
module.exports = tseslint.config(
  {
    ignores: ["lib/**", "node_modules/**", "eslint.config.js"],
  },
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "tsconfig.json",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/adjacent-overload-signatures": "error",
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/no-empty-interface": "warn",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-namespace": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/prefer-for-of": "warn",
      "@typescript-eslint/triple-slash-reference": "error",
      "@typescript-eslint/unified-signatures": "warn",
      "comma-dangle": "warn",
      "constructor-super": "error",
      eqeqeq: ["warn", "always"],
      "import/no-deprecated": "warn",
      "import/no-extraneous-dependencies": "error",
      "import/no-unassigned-import": "warn",
      // TypeScript validates namespace member access itself; the static
      // import/namespace rule false-positives on the firebase-functions/v1
      // re-exports (e.g. functions.region), so defer to tsc here.
      "import/namespace": "off",
      "no-cond-assign": "error",
      "no-duplicate-case": "error",
      "no-duplicate-imports": "error",
      "no-empty": [
        "error",
        {
          allowEmptyCatch: true,
        },
      ],
      "no-invalid-this": "error",
      "no-new-wrappers": "error",
      "no-param-reassign": 0,
      "no-redeclare": "error",
      "no-sequences": "error",
      "no-shadow": [
        "error",
        {
          hoist: "all",
        },
      ],
      "no-throw-literal": "error",
      "no-unsafe-finally": "error",
      "no-unused-labels": "error",
      "no-var": "warn",
      "no-void": "error",
      "prefer-const": "warn",
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "tsconfig.json",
        },
      },
      jsdoc: {
        tagNamePreference: {
          returns: "return",
        },
      },
    },
  }
);
