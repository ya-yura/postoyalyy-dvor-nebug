import { cp, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = path.resolve(import.meta.dirname, "..");
const clientRoot = path.join(projectRoot, "dist", "client");
const pagesRoot = path.join(projectRoot, "pages");
const basePath = process.env.PAGES_BASE_PATH || "/";

const { default: worker } = await import(pathToFileURL(path.join(projectRoot, "dist", "server", "index.js")).href);
const response = await worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), {
  ASSETS: {
    fetch: async (request) => {
      const pathname = new URL(request.url).pathname.replace(/^\/+/, "");
      const assetPath = path.join(clientRoot, pathname);
      try {
        await stat(assetPath);
        return new Response(await readFile(assetPath));
      } catch {
        return new Response("Not found", { status: 404 });
      }
    },
  },
}, { waitUntil() {}, passThroughOnException() {} });

if (!response.ok) throw new Error(`Could not render the Pages entry: ${response.status}`);

await mkdir(pagesRoot, { recursive: true });
await cp(clientRoot, pagesRoot, { recursive: true, force: true });

const rootPrefix = basePath.endsWith("/") ? basePath : `${basePath}/`;
const html = await response.text();
const scopedHtml = html.replace(/(["'(])\/(photos|_next|favicon\.svg|file\.svg|globe\.svg|window\.svg)/g, `$1${rootPrefix}$2`);
await writeFile(path.join(pagesRoot, "index.html"), scopedHtml, "utf8");

console.log(`GitHub Pages artifact exported to ${pagesRoot}`);
