module.exports = ((env, args) => {
    const config = {
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: {
            static: './dist',
        },
    }
    return config
})()