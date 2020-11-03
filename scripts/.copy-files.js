const { readdirSync, copyFileSync } = require("fs");
const { join, basename } = require("path");
const currPath = __dirname;

const BUILD_STATIC = join(currPath, "..", "build_static/");
const DOCS = join(currPath, "..", "docs/");
readdirSync(BUILD_STATIC).forEach((x) => {
  console.log(x);
  copyFileSync(join(BUILD_STATIC, x), join(DOCS, basename(x)));
});
