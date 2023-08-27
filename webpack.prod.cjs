
/* export default async (env, options) => {
    const config = {
        mode: 'production', 
    }
    return config
} */

module.exports = ((env, args) => {
    config = {
        mode: 'production',
        optimization: {
            realContentHash: false, // See https://github.com/jantimon/html-webpack-plugin/issues/1638
        }
    }
    return config
})()