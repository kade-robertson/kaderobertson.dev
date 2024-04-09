import fs from "fs-extra";
import { inlineSource } from "inline-source";

// Copy files from 'src' to 'dist'.
try {
  if ((await fs.stat("dist")).isDirectory()) {
    await fs.rm("dist", { recursive: true, force: true });
  }
} catch {
  // 'dist' doesn't exist, proceed as normal.
} finally {
  await fs.copy("src", "dist");
}

await fs.writeFile("dist/index.html", await inlineSource("dist/index.html"));
