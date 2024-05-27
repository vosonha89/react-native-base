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
      'prettier/prettier': 0,
      "semi": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/semi": [
        "error",
        "always"
      ],
      "@typescript-eslint/space-before-function-paren": [
        "off",
        "never"
      ],
      "@typescript-eslint/indent": "off",
      "@typescript-eslint/no-var-requires": 0,
      "unicode-bom": 0,
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/member-delimiter-style": [
        "error",
        {
          "multiline": {
            "delimiter": "semi",
            "requireLast": true
          },
          "singleline": {
            "delimiter": "semi",
            "requireLast": false
          },
          "multilineDetection": "brackets"
        }
      ],
      "@typescript-eslint/no-this-alias": [
        "error",
        {
          "allowDestructuring": true,
          // Allow `const { props, state } = this`; false by default
          "allowedNames": [
            "me"
          ]
          // Allow `const me= this`; `[]` by default
        }
      ],
      "@typescript-eslint/consistent-type-assertions": "warn",
      "@typescript-eslint/no-useless-constructor": "off",
      "no-debugger": "off"
    }
  }
];