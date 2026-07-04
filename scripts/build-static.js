const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const files = ["index.html", "about.html", "assets"];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of files) {
  const source = path.join(root, file);
  const target = path.join(dist, file);

  if (!fs.existsSync(source)) {
    throw new Error(`Missing build input: ${file}`);
  }

  fs.cpSync(source, target, { recursive: true });
}

console.log(`Static site built in ${path.relative(root, dist)}`);
