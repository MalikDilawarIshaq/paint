module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: ["eslint:recommended", "airbnb", "plugin:react/recommended"],
  rules: {
    "linebreak-style": 0,
    "jsx-a11y/label-has-associated-control": [
      "error",
      {
        require: {
          some: ["nesting", "id"],
        },
      },
    ],
    "jsx-a11y/label-has-for": [
      "error",
      {
        required: {
          some: ["nesting", "id"],
        },
      },
    ],
  },
  parserOptions: {
    ecmaVersion: 11,
  },
};
