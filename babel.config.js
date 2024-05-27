module.exports = {
  presets: ['module:@react-native/babel-preset'],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "version": "2023-11" }],
    "@babel/plugin-transform-class-static-block",
    ["@babel/plugin-transform-class-properties", { "loose": true }],
    [
      "module:react-native-dotenv",
      {
        envName: "APP_ENV",
        moduleName: "@env",
        path: ".env"
      }
    ]
  ]
};
