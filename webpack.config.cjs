const merge = require('webpack-merge').merge

const commonConfig = require('./webpack.common.cjs');
const productionConfig = require('./webpack.prod.cjs');
const developmentConfig = require('./webpack.dev.cjs');

module.exports = (env, args) => {
  switch (args.mode) {
    case 'development':
      return merge(commonConfig, developmentConfig);
    case 'production':
      return merge(commonConfig, productionConfig);
    default:
      throw new Error('No matching configuration was found!');
  }
}
