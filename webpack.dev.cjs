module.exports = ((env, args) => {
    const config = {
        devtool: 'inline-source-map',
        devServer: {
            static: './dist',
            watchFiles: {
                paths: ['src/**/*.*'],
                options: {
                    usePolling: true,
                },
            },
            client: {
                overlay: {
                    warnings: false,
                }
            },
        },
    }
    return config
})()