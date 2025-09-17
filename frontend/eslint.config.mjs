// frontend/eslint.config.mjs
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import a11y from "eslint-plugin-jsx-a11y";
import promise from "eslint-plugin-promise";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import unicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

const STRICT_TS_FILES = [
  "src/lib/**/*.{ts,tsx}",
  "src/hooks/**/*.{ts,tsx}",
  "src/app/api/**/*.{ts,tsx}"
];

export default [
  // 0) Ignore
  {
    ignores: [
      "**/node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "out/**",
      "coverage/**",
      ".turbo/**",
      ".cache/**",
      ".yarn/**",
      ".pnpm-store/**",
      "public/vendor/**",
      "tools/**",
      "tools/.venv/**",
      "**/*.min.js",
      "**/*.snap",
      "**/*.generated.*",
      "legal_texts.generated.json"
    ]
  },

  // 1) Base JS (no style rules — Prettier s’en charge)
  js.configs.recommended,
  prettier,

  // 2) Bloc commun
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "@next/next": nextPlugin,
      import: importPlugin,
      "react-hooks": reactHooks,
      "unused-imports": unusedImports,
      "jsx-a11y": a11y,
      promise,
      unicorn,
      "react-refresh": reactRefresh
    },
    settings: {
      "import/resolver": {
        typescript: { project: "./tsconfig.eslint.json" },
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] }
      }
    },
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    rules: {
      // Nettoyage auto
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_"
        }
      ],

      // Fichiers / exports non utilisés
      "import/no-unused-modules": [
        "error",
        {
          // Tous les fichiers à vérifier (adapte si besoin)
          src: ["src/**/*.{ts,tsx,js,jsx}"],
          // Signaler les exports jamais utilisés
          unusedExports: true,
          // Signaler les fichiers sans exports jamais importés
          missingExports: true,
          // Fichiers "consommés" par Next/middleware
          ignoreExports: [
            "src/app/**/page.tsx",
            "src/app/**/layout.tsx",
            "src/app/**/error.tsx",
            "src/app/**/loading.tsx",
            "src/app/**/template.tsx",
            "src/app/**/route.ts",
            "src/middleware.ts",
            "src/**/*.d.ts"
          ]
        }
      ],

      // Qualité générale
      eqeqeq: ["error", "smart"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-implicit-globals": "error",
      "no-throw-literal": "error",
      "no-return-await": "error",
      "prefer-const": "error",
      "no-var": "error",

      // Imports
      "import/no-duplicates": "error",
      "import/newline-after-import": "error",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true }
        }
      ],

      // Next & a11y
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-sync-scripts": "error",
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",

      // Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",

      // Anti-boucles / patterns dangereux
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "CallExpression[callee.object.name='React'][callee.property.name='useMemo'] CallExpression[callee.name=/^set[A-Z].*/]",
          message: "Éviter d'appeler un setter React dans useMemo (risque de boucle)."
        },
        {
          selector: "JSXElement CallExpression[callee.name=/^set[A-Z].*/]",
          message:
            "Ne pas appeler un setter React pendant le rendu (déplacer dans un effet/handler)."
        },
        {
          selector:
            "CallExpression[callee.object.name='React'][callee.property.name='useEffect']:not([arguments.1])",
          message: "Toujours fournir le tableau de dépendances à useEffect."
        }
      ],

      // Bruit inutile avec Prettier
      "object-curly-newline": "off",
      "object-property-newline": "off",
      "react/no-unescaped-entities": "off"
    }
  },

  // 3) STRICT **avec types** — appliquer le preset sur un SOUS-ARBRE
  ...tseslint.configs.recommendedTypeChecked.map((c) => ({
    ...c,
    files: STRICT_TS_FILES,
    languageOptions: {
      ...c.languageOptions,
      parser: tseslint.parser,
      parserOptions: {
        ...(c.languageOptions?.parserOptions ?? {}),
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: process.cwd()
      }
    }
  })),
  {
    files: STRICT_TS_FILES,
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports"
        }
      ],
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true
        }
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } }
      ],
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-confusing-void-expression": [
        "error",
        { ignoreArrowShorthand: true }
      ],
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "import/no-unresolved": "error"
    }
  },

  // 4) UI/Pages — typed-lint allégé
  {
    files: [
      "src/components/**/*.{ts,tsx}",
      "src/app/**/*.{ts,tsx}",
      "src/content/**/*.{ts,tsx}"
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: process.cwd()
      }
    },
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "import/no-unresolved": "warn",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }]
    }
  },

  // 5) Fichiers Next spéciaux & routing
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

  // 6) JS/Configs Node
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
