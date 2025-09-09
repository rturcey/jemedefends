// frontend/eslint.config.mjs
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import importPlugin from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import a11y from "eslint-plugin-jsx-a11y";
import promise from "eslint-plugin-promise";
import unicorn from "eslint-plugin-unicorn";
import prettier from "eslint-config-prettier";

export default [
  // 0) Ignore
  {
    ignores: [
      "**/node_modules/**", ".next/**", "dist/**", "build/**", "out/**",
      "coverage/**", ".turbo/**", ".cache/**", ".yarn/**", ".pnpm-store/**",
      "public/vendor/**", "tools/**", "tools/.venv/**",
      "**/*.min.js", "**/*.snap", "**/*.generated.*",
      "legal_texts.generated.json"
    ]
  },

  // 1) Base JS (no style rules — Prettier s’en charge)
  js.configs.recommended,
  prettier,

  // 2) Bloc commun (plugins/règles transverses)
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "@next/next": nextPlugin,
      import: importPlugin,
      "react-hooks": reactHooks,
      "unused-imports": unusedImports,
      "jsx-a11y": a11y,
      promise,
      unicorn
    },
    settings: {
      "import/resolver": {
        typescript: { project: "./tsconfig.eslint.json" },
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] }
      }
    },
    rules: {
      // Nettoyage auto
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": ["warn", {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_"
      }],

      // Qualité générale
      "eqeqeq": ["error", "smart"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-implicit-globals": "error",
      "no-throw-literal": "error",
      "no-return-await": "error",
      "prefer-const": "error",
      "no-var": "error",

      // Imports
      "import/no-duplicates": "error",
      "import/newline-after-import": "error",
      "import/order": ["error", {
        groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true }
      }],

      // Next & a11y
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "error",
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",

      // Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Bruit inutile avec Prettier
      "object-curly-newline": "off",
      "object-property-newline": "off",
      "react/no-unescaped-entities": "off"
    }
  },

  // 3) STRICT **avec types** — uniquement code “métier”
  {
    files: ["src/lib/**/*.{ts,tsx}", "src/hooks/**/*.{ts,tsx}", "src/app/api/**/*.{ts,tsx}"],
    ...tseslint.configs.recommendedTypeChecked,
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: process.cwd()
      }
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": ["error", {
        prefer: "type-imports",
        fixStyle: "separate-type-imports"
      }],
      "@typescript-eslint/explicit-function-return-type": ["error", {
        allowExpressions: true,
        allowHigherOrderFunctions: true,
        allowDirectConstAssertionInArrowFunctions: true
      }],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: { attributes: false } }],
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-confusing-void-expression": ["error", { ignoreArrowShorthand: true }],
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "import/no-unresolved": "error"
    }
  },

  // 4) UI/Pages — typed-lint **allégé** (on corrige progressivement le “any”)
  {
    files: ["src/components/**/*.{ts,tsx}", "src/app/**/*.{ts,tsx}", "src/content/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: process.cwd()
      }
    },
    // Pas de recommendedTypeChecked ici pour éviter l’avalanche
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off", // trop verbeux pour 100+ composants :contentReference[oaicite:7]{index=7}
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "import/no-unresolved": "warn"
    }
  },

  // 5) Fichiers Next spéciaux & routing : pas de filename-case
  {
    files: [
      "src/app/**/layout.tsx",
      "src/app/**/page.tsx",
      "src/app/**/not-found.tsx",
      "src/app/**/error.tsx",
      "src/app/**/loading.tsx",
      "src/app/**/template.tsx"
    ],
    rules: { "unicorn/filename-case": "off" }
  },

  // 6) JS/Configs Node : pas de typed-lint + globals Node
  {
    files: [
      "eslint.config.mjs",
      "jest.config.*",
      "jest.setup.*",
      "next.config.js",
      "postcss.config.js",
      "lighthouse.config.js",
      "tailwind.config.js",
      "**/*.{config,setup}.{js,mjs,ts,cts}"
    ],
    languageOptions: {
      parserOptions: { project: null },
      sourceType: "module",
      globals: {
        module: "readonly",
        require: "readonly",
        process: "readonly",
        __dirname: "readonly"
      }
    },
    rules: { "no-undef": "off" }
  }
];
