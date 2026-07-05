import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  {
    languageOptions: { globals: globals.browser },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  {
    settings: { react: { version: "detect" } },
    rules: {
      "semi": ["error", "always"],
      "no-debugger": "off",
      "no-useless-constructor": "off",
      "no-var": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/no-this-alias": [
        "error",
        {
          "allowDestructuring": true,
          "allowedNames": ["me"]
        }
      ]
    }
  }
];