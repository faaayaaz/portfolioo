import ts from "typescript";
import { readFile, writeFile } from "node:fs/promises";
const source = await readFile(
  new URL("../src/data/content.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const { profile, projects, ui } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);
const pages = {
  "/": { title: ui.siteTitle, description: profile.introduction },
  ...Object.fromEntries(
    projects.map((p) => [
      `/projects/${p.slug}`,
      { title: `${p.title} — ${profile.name}`, description: p.description },
    ]),
  ),
};
await writeFile(
  new URL("../public/route-meta.json", import.meta.url),
  JSON.stringify(
    {
      pages,
      person: {
        "@context": "https://schema.org",
        "@type": "Person",
        name: profile.name,
        jobTitle: profile.role,
        email: profile.email,
        sameAs: [profile.linkedin, profile.github],
      },
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Prepared metadata for ${Object.keys(pages).length} routes from src/data/content.ts`,
);
