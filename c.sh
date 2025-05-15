#!/bin/bash

# Output file
OUTPUT_FILE="git_commits_with_tags.log"

# Run git log and save to the file
git log --pretty=format:"%h - %an, %ad %d%n    %s%n" --date=short >"$OUTPUT_FILE"

# Notify user
echo "Git commit log with tags saved to $OUTPUT_FILE"
