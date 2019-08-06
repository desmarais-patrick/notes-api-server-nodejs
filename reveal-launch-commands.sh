#!/bin/bash

echo
echo "Run the following command to locally start in different terminals:"
echo
echo " - Database server"
echo
echo "   > gcloud beta emulators datastore start --data-dir=data"
echo
echo " - API server"
echo
echo '   > $(gcloud beta emulators datastore env-init --data-dir=data)'
echo '   > export NODE_END=development'
echo "   > npm start"
echo

exit 0

# TODO
# Launch database
# Redirect output (erase and write line instead of prompt to quit)
# Wait for 'q' to exit database.
# Confirm it doesn't accept requests before exiting.

# (?) Database and API server in the same terminal?
# (?) Rewrite multiple line on screen like "less" or "more" commands?
