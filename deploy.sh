# deploy.sh

# store deployment command into a string with character % where function name should be
# TODO: read the .env file instead of hardcoding here:
deploy="gcloud functions deploy % --runtime nodejs10 --trigger-http --allow-unauthenticated --env-vars-file .env.yaml"

# find all functions in index.js (looking at exports.<function_name>) using sed
# then pipe the function names to xargs
# then instruct that % should be replaced by each function name
# then open 20 processes where each one runs one deployment command
sed -n 's/exports\.\([a-zA-Z0-9\-_#]*\).*/\1/p' index.js | xargs -I % -P 20 sh -c "$deploy;"

# TODO, the above also includes deploying a function called 'local' which we have in our index.js for local development, we should modify the above regex to skip that one
