#!/bin/bash

set -e

show_usage() {
    echo "Usage:"
    echo "  $0 MigrationName        # generate and run migration"
    echo "  $0 -r                   # only run migrations (no generation)"
    echo "  $0 -n MigrationName     # only generate migration (no run)"
    echo ""
    echo "Flags -r and -n are mutually exclusive."
    exit 1
}

RUN_ONLY=false
GENERATE_ONLY=false
MIGRATION_NAME=""

# Parse flags
while getopts ":rn" opt; do
    case $opt in
    r)
        RUN_ONLY=true
        ;;
    n)
        GENERATE_ONLY=true
        ;;
    \?)
        echo "Invalid option: -$OPTARG" >&2
        show_usage
        ;;
    esac
done

# Remove parsed options from arguments
shift $((OPTIND - 1))

# Validate flags
if $RUN_ONLY && $GENERATE_ONLY; then
    echo "Error: Flags -r and -n cannot be used together."
    show_usage
fi

if $RUN_ONLY; then
    # Run migrations only, no migration name needed
    echo "🚀 Running migrations only..."
    npx typeorm migration:run -d dist/DataSource.js
    echo "✅ Migrations run successfully."
    exit 0
fi

if $GENERATE_ONLY; then
    # Generate only requires migration name
    if [ -z "$1" ]; then
        echo "Error: Migration name is required with -n flag."
        show_usage
    fi
    MIGRATION_NAME=$1
    echo "🛠 Generating migration only: $MIGRATION_NAME"
    npx typeorm migration:generate -d dist/DataSource.js src/migrations/"$MIGRATION_NAME"
    echo "✅ Migration '$MIGRATION_NAME' generated."
    exit 0
fi

# Default: generate AND run migration — migration name required
if [ -z "$1" ]; then
    echo "Error: Migration name is required."
    show_usage
fi

MIGRATION_NAME=$1

echo "🛠 Generating migration: $MIGRATION_NAME"
npx typeorm migration:generate -d dist/DataSource.js src/migrations/"$MIGRATION_NAME"

echo "🚀 Running migration..."
npx typeorm migration:run -d dist/DataSource.js

echo "✅ Migration '$MIGRATION_NAME' generated and applied."
