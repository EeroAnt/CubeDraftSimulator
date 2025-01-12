// eslint.config.js
import eslintPluginImport from "eslint-plugin-import";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module", // Tukee ECMAScript-moduuleita
      globals: {
        console: "readonly", // Määrittää console-globaalin
        process: "readonly",
        clearInterval: "readonly",
        setInterval: "readonly",
      },
    },
    rules: {
      "max-len": ["error", { code: 80 }],
      "semi": "error",
      "prefer-const": "error",
      "no-undef": "error", // Herjaa määrittelemättömistä muuttujista
      "no-unused-vars": "warn", // Herjaa käyttämättömistä muuttujista
      "no-console": ["warn", { allow: ["log", "error"] }],
    },
    plugins: {
      import: eslintPluginImport,
    },
  },
];