module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/essential',
  ],
  rules: {
    // override/add rules settings here, such as:
    'vue/no-console': 'off',
    'vue/multi-word-component-names': 'warn',
    'vue/no-mutating-props': 'warn',
  },
};
