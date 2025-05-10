# HSBC Credit Card Statement Processor

A simple web application to convert downloaded HSBC-format CSV credit card statements to Xero format CSV.

## Development Setup

This project uses [Vite](https://vitejs.dev/) for development and building.

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The development server will be available at http://localhost:3000 with hot module replacement enabled.

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Building for Production

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

The production build will be available in the `dist` folder.

## Project Structure

- `src/`: Source code
  - `index.html`: Main HTML file
  - `index.ts`: Entry point for the application
  - `index.scss`: Main stylesheet
  - Other TypeScript files for application logic
- `test/`: Test files
- `dist/`: Production build output (generated when running `npm run build`)

## Technologies Used

- TypeScript
- Vite
- Vitest for testing
- Bootstrap for styling
- CSV-Parse for parsing CSV files
