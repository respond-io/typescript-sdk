cp package.json ./dist/package.json
# cp CHANGELOG.md ./dist/CHANGELOG.md
cp README.md ./dist/README.md
cp LICENSE ./dist/LICENSE

jq '
  .main = "index.js" |
  .types = "index.d.ts" |
  .module = "index.mjs" |
  .exports["."].require = "./index.js" |
  .exports["."].import = "./index.mjs"
' ./dist/package.json > ./dist/package.tmp.json && \
mv ./dist/package.tmp.json ./dist/package.json

