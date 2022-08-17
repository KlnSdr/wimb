echo "Hello World"
rm -rf docs
tsc
mkdir ../docs
cp -r ./ ../docs
rm -rf ../docs/.git
rm -rf ../docs/node_modules
rm -rf ../docs/**/*.ts
mv ../docs ./
rm docs/package.json
rm docs/package-lock.json
rm docs/tsconfig.json
rm docs/.gitignore
rm docs/.prettierrc
rm docs/deploy.sh
find ./docs -name "*.ts" -delete
