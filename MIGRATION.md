# Migration from Webpack to Vite

This document summarizes the changes made to migrate the project from Webpack to Vite.

## Changes Made

1. **Build System**

   - Replaced Webpack with Vite for faster development and builds
   - Removed Webpack-related dependencies
   - Added Vite plugins for legacy browsers support

2. **Configuration Files**

   - Created `vite.config.js` for Vite configuration
   - Created `vitest.config.js` for test configuration
   - Updated `tsconfig.json` for better Vite compatibility
   - Added `.browserslistrc` for browser compatibility
   - Added ESLint and Prettier configurations

3. **Package Scripts**

   - Updated scripts in `package.json` to use Vite commands
   - Added linting and formatting scripts
   - Added test commands using Vitest

4. **Testing**

   - Migrated from Mocha to Vitest for faster testing
   - Updated test files to use Vitest syntax
   - Added JSDOM for browser environment testing

5. **CSS/SCSS**
   - Configured Vite to handle SCSS files
   - Updated imports in TypeScript files

## Benefits of Vite

- **Faster Development**: Near-instantaneous hot module replacement
- **Modern Build System**: Built on top of Rollup for efficient bundling
- **TypeScript Support**: Native TypeScript support without additional configuration
- **Better Asset Handling**: Improved asset handling and optimization
- **ESM-First**: Leverages native ES modules for better performance

## Usage

- Development: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`
- Run tests: `npm test`
- Lint code: `npm run lint`
- Format code: `npm run format`

## Notes

- The project structure remains the same, only the build tooling has changed.
