// postcss.config.js
export default {
    plugins: {
        autoprefixer: {
            // Target only modern browsers (matches browserslistrc)
            overrideBrowserslist: [
                'last 2 Chrome versions',
                'last 2 Firefox versions',
                'last 2 Safari versions',
                'last 2 Edge versions'
            ]
        }
    }
};
