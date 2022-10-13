module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "@nuxtjs/eslint-config-typescript",
    "plugin:prettier/recommended",
    "plugin:nuxt/recommended",
  ],
  plugins: ["prettier"],
  // add your custom rules here
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    // Enforce specific casing for the component naming style in template
    "vue/component-name-in-template-casing": [
      "error",
      "PascalCase",
      {
        registeredComponentsOnly: true,
        ignores: [],
      },
    ],
    // Enforce specific casing for custom event name
    "vue/custom-event-name-casing": [
      "error",
      "kebab-case",
      {
        ignores: [],
      },
    ],
    // Disallow usage of button without an explicit type attribute
    "vue/html-button-has-type": [
      "error",
      {
        button: true,
        submit: true,
        reset: true,
      },
    ],
    // Enforce unified spacing in HTML comments
    "vue/html-comment-content-spacing": [
      "error",
      "always",
      {
        exceptions: [],
      },
    ],
    // Enforce new lines between multi-line properties in Vue components
    "vue/new-line-between-multi-line-property": [
      "error",
      {
        minLineOfMultilineProperty: 2,
      },
    ],
    // Disallow unused properties
    "vue/no-unused-properties": [
      "error",
      {
        groups: ["props", "data", "computed", "methods"],
        deepData: true,
        ignorePublicMembers: true,
      },
    ],
    // Disallow unnecessary v-bind directives
    "vue/no-useless-v-bind": [
      "error",
      {
        ignoreIncludesComment: false,
        ignoreStringEscape: false,
      },
    ],
    // Require or disallow padding lines between blocks
    "vue/padding-line-between-blocks": ["error", "always"],
    // Require a name property in Vue components
    "vue/require-name-property": ["error"],
    // Enforce v-on event naming style on custom components in template
    "vue/v-on-event-hyphenation": [
      "error",
      "always",
      {
        autofix: false,
        ignore: [],
      },
    ],
    // Enforce or forbid parentheses after method calls without arguments in v-on directives
    "vue/v-on-function-call": [
      "error",
      "never",
      {
        ignoreIncludesComment: false,
      },
    ],
    // Enforce valid nextTick function calls
    "vue/valid-next-tick": ["error"],
    "@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
  },
};
