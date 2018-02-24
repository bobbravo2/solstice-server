#!/bin/bash
if ! [ -x "$(command -v csvtojson)" ]; then
    echo "CSV to JSON converter is not installed"
    echo "Installing..."
    yarn global add csvtojson
    echo "Requirements installed. Continuing with update."
fi
echo "Updating JSON files from source CSV files"
for filePath in data/csv-source/*.csv; do
    # Skip hidden files / symlinks
    [ -e "$filePath" ] || continue


    #Extract the user id from the file name
    user_id="$(basename $filePath .csv)"
    echo "Updating path: $filePath, user_id: $user_id"
    csvtojson $filePath > data/records/$user_id.json
done