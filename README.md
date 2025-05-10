# HSBC Credit Card Statement Processor

A simple web application to convert downloaded HSBC-format CSV credit card statements to Xero format CSV.

## Browser Support

This application is designed for modern browsers only:
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

Internet Explorer is not supported.

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

The project follows a feature-based organization:

```
src/
├── core/                # Core utilities, types, and base functionality
│   ├── types/           # TypeScript interfaces and types
│   ├── utils/           # Utility functions
│   └── config/          # App configuration
├── features/            # Feature-based modules
│   ├── csv-processing/  # CSV functionality
│   │   ├── services/    # CSV processing logic
│   │   └── tests/       # Tests for CSV processing
│   └── file-handling/   # File handling functionality
│       ├── services/    # File operations
│       └── tests/       # Tests for file handling
├── ui/                  # UI components and styling
│   ├── components/      # Reusable UI components
│   └── styles/          # SCSS files
└── assets/              # Static assets
```

## Testing

Tests are co-located with their corresponding features:

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```
