if [[ $1 == '--help' || $1 == '-h' ]]; then
    echo 'Usage: deploy [dev]'
    echo -e '\nDeploy the Node app using pm2 in the ENV specified in .env file'
    echo -e '\nFor running in local dev mode, use: deploy dev'
    exit
fi

echo '[Updating code from Git]'
git pull

echo -e '\n[Installing dependencies]'
yarn install

echo -e '\n[Running microservice]'
if [[ $# -eq 0 ]]; then
    pm2 stop api-ms
    pm2 delete api-ms
    yarn start
else
    yarn start:$1
fi
