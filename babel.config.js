module.exports = {
  presets: [
    ["@babel/preset-react", {
      "runtime": "automatic",
      "importSource": "@emotion/react",
      "plugins": ["@babel/plugin-proposal-class-properties"]
    }]
  ]
  
}