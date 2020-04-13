module.exports = {
  presets: [
    "@babel/preset-env"
  ],
  plugins: [
    ["@babel/plugin-proposal-pipeline-operator", {
      proposal: `smart`
    }],
    "@babel/plugin-proposal-do-expressions"
  ]
}