
/* export default async (env, options) => {
    const config = {
        mode: 'production', 
    }
    return config
} */

module.exports = ((env, args) => {
    const config = {
        optimization: {
            realContentHash: false, // See https://github.com/jantimon/html-webpack-plugin/issues/1638
        },
        performance: {
            hints: 'warning',
            maxEntrypointSize: 512000,
            maxAssetSize: 512000,
        },
    }
    return config
})()