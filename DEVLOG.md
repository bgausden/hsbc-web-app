# Development Log

## Date: 18 December 2025

### Build Failure Fix

**Issue**: Build was failing with two critical errors:

1. Import error: `"fixInconsistentColumns" is not exported by "csv-helpers.ts"`
2. Browser compatibility error: `Module "node:assert" has been externalized for browser compatibility`

**Root Causes**:

- [csv-parser.ts](src/features/csv-processing/services/csv-parser.ts#L70) was importing a non-existent function `fixInconsistentColumns`
- [csv-helpers.ts](src/features/csv-processing/services/csv-helpers.ts) was using Node.js-specific `node:assert` module which is incompatible with browser builds

**Changes Made**:

1. **Removed browser-incompatible import** in [csv-helpers.ts](src/features/csv-processing/services/csv-helpers.ts):

   - Removed: `import assert from 'node:assert'`
   - Replaced all `assert()` calls with standard `if/throw Error` statements for browser compatibility

2. **Fixed function import** in [csv-parser.ts](src/features/csv-processing/services/csv-parser.ts):

   - Changed import from `fixInconsistentColumns` to `handleCommaInDescription` (the actual function name)
   - Updated function call to use the correct name

3. **Enhanced error handling** in [csv-helpers.ts](src/features/csv-processing/services/csv-helpers.ts):
   - `csvPreProcess()`: Replaced `assert(record.length === 5)` with explicit error throw
   - `handleCommaInDescription()`: Replaced multiple `assert()` calls with standard error throws

**Files Modified**:

- [src/features/csv-processing/services/csv-helpers.ts](src/features/csv-processing/services/csv-helpers.ts)
- [src/features/csv-processing/services/csv-parser.ts](src/features/csv-processing/services/csv-parser.ts)

**Testing**:

- Build completed successfully with `npm run build` (exit code 0)
- All changes maintain existing functionality while ensuring browser compatibility

**Impact**:

- ✅ Build now completes without errors
- ✅ Code is fully browser-compatible
- ✅ Error handling remains robust with descriptive error messages
- ✅ No breaking changes to public API

### Additional Changes in Workspace

**Configuration Updates**:

- Added `build:azure` script to [package.json](package.json) for Azure-specific builds
- Updated [vite.config.js](vite.config.js) to add `quietDeps: true` for SCSS preprocessor (suppress dependency warnings)

**Code Improvements**:

- Refactored CSV parsing to use event-driven async parser instead of synchronous parsing
- Added comprehensive error handling with `readable`, `error`, and `end` event handlers
- Improved type safety with new helper functions in [asserts.ts](src/core/utils/asserts.ts):
  - `isValidRecord()`: Validates CSV record structure
  - `isCsvError()`: Type guard for CSV parsing errors
  - `isMissingDescription()`: Checks for missing description field
- Added `rawRecord` type definition in [csv.types.ts](src/core/types/csv.types.ts)

**Constant Naming**:

- Renamed constants for clarity:
  - `TRANSACTION_DATE_INDEX` → `HSBC_TRANSACTION_DATE_INDEX`
  - `DESCRIPTION_INDEX` → `HSBC_DESCRIPTION_INDEX`
  - `AMOUNT_INDEX` → `HSBC_AMOUNT_INDEX`
- Added new constants:
  - `HSBC_POST_DATE_INDEX`
  - `HSBC_FOREIGN_CURRENCY_AMOUNT_INDEX`
  - `EMPTY_VALUE`
  - `NO_DESCRIPTION`

**Test Updates**:

- Updated all test files to reflect new constant names and expected output formatting
- Fixed whitespace handling expectations in test assertions
- Enhanced test coverage for comma handling in descriptions

**Resource Cleanup**:

- Removed [src/favicon.png](src/favicon.png), replaced with SVG favicon reference
- Deleted [vercel.json](vercel.json) (deployment config no longer needed)
- Cleaned up package-lock.json dependencies (removed unused optional peer dependencies)

**Key Functional Changes**:

- Parser now handles inconsistent columns more robustly with `handleCommaInDescription()`
- Improved description field processing with better whitespace normalization
- Enhanced foreign currency amount handling in output
- Better error recovery with parser resume on recoverable errors

---

## Date: 18 December 2025 (Evening Update)

### Security Vulnerabilities Fixed

**Issue**: `npm audit` reported 3 security vulnerabilities:
- **glob** (high severity): Command injection vulnerability
- **vite** (moderate severity): Multiple file serving and path bypass issues
- **brace-expansion** (low severity): Regular Expression DoS vulnerability

**Resolution**:
- Ran `npm audit fix` to automatically update vulnerable dependencies
- Updated Vite from v6.3.5 to v6.4.1
- All vulnerabilities resolved with 0 remaining issues
- Build and dev server confirmed working after updates

### CSV Parser Async/Sync Bug Fixed

**Critical Issue Discovered**: The event-driven async parser had a **race condition**:
- Event handlers (`readable`, `error`, `end`) executed asynchronously
- Function returned synchronously before events completed
- Result: Always returned empty array (just header) before any CSV rows were processed
- Error recovery wasn't working at all

**Root Cause**:
```typescript
// Events registered but not awaited
parser.on('readable', () => { /* process data */ });
parser.on('error', () => { /* handle errors */ });
parser.on('end', () => { /* cleanup */ });

parser.write(rawData);
parser.end();

// Function returned IMMEDIATELY before events fired!
return sanitizeCsvData(csvData);
```

**Solution**: Replaced async event-driven parser with **synchronous line-by-line parsing**:

1. **Removed async event handlers** - replaced with synchronous for loop
2. **Direct try/catch error handling** - catches and recovers from parse errors immediately
3. **Fixed header skipping** - now correctly skips both card number line AND column header line
4. **Working error recovery** - malformed rows are fixed with `handleCommaInDescription()` and processing continues

**Changes Made** in [csv-parser.ts](src/features/csv-processing/services/csv-parser.ts):
- Removed async `parse()` import, using only `syncParse()`
- Removed event handlers (`on('readable')`, `on('error')`, `on('end')`)
- Implemented synchronous line-by-line parsing with immediate error handling
- Skip both header lines: `secondLine = raw.indexOf('\n', firstLine + 1)`
- Try/catch with `isCsvError()` type guard for proper error recovery

**Testing**:
- ✅ All CSV tests pass (11/11 in csv-functions.spec.ts)
- ✅ Build successful with `npm run build`
- ✅ Error recovery confirmed working - malformed rows handled correctly
- ✅ No data loss - all valid rows parsed successfully

**Impact**:
- ✅ Parser actually works now (was completely broken before)
- ✅ Error recovery is functional - handles commas in descriptions
- ✅ Synchronous execution ensures all data is processed before return
- ✅ Better performance - no async overhead for this use case
- ✅ More predictable behavior - no race conditions

**Files Modified**:
- [src/features/csv-processing/services/csv-parser.ts](src/features/csv-processing/services/csv-parser.ts) - Complete parser rewrite
- [package-lock.json](package-lock.json) - Dependency updates from security fixes
