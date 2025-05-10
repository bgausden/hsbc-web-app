#!/bin/zsh
# Migration cleanup script

echo "=== Cleaning up old files after migration ==="

# Create a backup directory for old files
mkdir -p .old_src_backup

# Move old files to backup
echo "Moving old files to .old_src_backup..."
mv src/_custom.scss src/asserts.ts src/createSampleTable.ts src/csv-functions.ts src/handleFileChange.ts src/handleSubmit.ts .old_src_backup/

echo "Testing the new structure..."
npm run test

if [ $? -eq 0 ]; then
    echo "✅ Tests passed with new structure!"
else
    echo "❌ Tests failed with new structure. You may need to revert some changes."
    exit 1
fi

echo "=== Migration completed successfully ==="
echo "The old files are backed up in .old_src_backup/"
echo "You can safely delete them if everything works as expected."
