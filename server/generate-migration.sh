#!/bin/bash

# Exit on error
set -e

# Check for migration name
if [ -z "$1" ]; then
    echo "Please provide a migration name."
    echo "Usage: ./generate-and-run-migration.sh MigrationName"
    exit 1
fi

MIGRATION_NAME=$1

echo "🛠 Generating migration: $MIGRATION_NAME"
npx typeorm migration:generate -d dist/DataSource.js src/migrations/"$MIGRATION_NAME"

echo "🚀 Running migration..."
npx typeorm migration:run -d dist/DataSource.js

echo "✅ Migration '$MIGRATION_NAME' generated and applied."
