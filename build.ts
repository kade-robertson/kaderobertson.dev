// @ts-ignore
import HtmlWebpackInlineSVGPlugin from "html-webpack-inline-svg-plugin";
import fs from "fs-extra";

// @ts-ignore
import critical from "critical";

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

// Parse for inline SVGs & rewrite
const htmlData = await fs.readFile("dist/index.html", { encoding: "utf-8" });

const svgInliner = new HtmlWebpackInlineSVGPlugin();
const svgInlinedHtmlData = await svgInliner.processImages(htmlData);

const { html: inlinedCssHtmlData } = await critical.generate({
  inline: true,
  base: "dist/",
  html: svgInlinedHtmlData,
  extract: true,
  width: 1300,
  height: 900,
});

await fs.writeFile("dist/index.html", inlinedCssHtmlData);
