import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem("fayaz-theme"))
      localStorage.setItem("fayaz-theme", "observatory");
  });
});
test("responsive layouts preserve content without horizontal overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [360, 768, 1024, 1440, 3840]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Welcome to");
    await expect(page.locator(".world-stage")).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Island destinations" }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `horizontal overflow at ${width}px`,
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});
test("mobile drawer, keyboard palette and persisted themes work", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Skills" })
    .click();
  await expect(page).toHaveURL(/#skills/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.keyboard.press("Control+k");
  await page
    .getByRole("textbox", { name: "Search pages and themes" })
    .fill("Violet");
  await page.getByRole("button", { name: "Midnight Violet" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "violet");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "violet");
  const stored = await page.evaluate(() => localStorage.getItem("fayaz-theme"));
  expect(stored).toBe("violet");
  await page.getByRole("button", { name: "Choose color theme" }).click();
  await page.getByRole("button", { name: /Clinical Light/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "clinical");
});
test("all four case studies, résumé download and unknown route work", async ({
  page,
}) => {
  for (const slug of [
    "healthcare-operations",
    "skin-cancer-detection",
    "workforce-analytics",
    "connected-home",
  ]) {
    await page.goto(`/projects/${slug}`);
    await expect(page.locator(".case-narrative section")).toHaveCount(4);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
      "href",
      new RegExp(slug),
    );
  }
  const pdf = await page.request.get("/Muhammed_Fayaz_Resume.pdf");
  expect(pdf.ok()).toBe(true);
  expect(pdf.headers()["content-type"]).toContain("pdf");
  expect((await pdf.body()).subarray(0, 4).toString()).toBe("%PDF");
  await page.goto("/missing");
  await expect(page.locator("h1")).toContainText("bigger picture");
});
test("live dashboard filters, metric switch and CSV export use the selected records", async ({
  page,
}) => {
  await page.goto("/#lab");
  const lab = page.locator("#lab");
  await expect(lab.locator(".live-dashboard")).toBeVisible();
  const initial = await lab.locator(".dashboard-kpi").first().innerText();
  await lab
    .getByLabel("Department", { exact: true })
    .selectOption("Cardiology");
  await expect(lab.locator(".dashboard-kpi").first()).not.toHaveText(initial);
  await expect(lab.locator(".dashboard-bottom")).toContainText("6 RECORDS");
  await lab.getByLabel("Date range", { exact: true }).selectOption("three");
  await expect(lab.locator(".dashboard-bottom")).toContainText("3 RECORDS");
  await lab.getByRole("button", { name: "Revenue", exact: true }).click();
  await expect(
    lab.getByRole("heading", { name: "The financial picture." }),
  ).toBeVisible();
  const download = page.waitForEvent("download");
  await lab.getByRole("button", { name: "Export sample" }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe("fayaz-synthetic-healthcare.csv");
  const stream = await file.createReadStream();
  let csv = "";
  for await (const chunk of stream!) csv += chunk.toString();
  expect(csv.trim().split("\n")).toHaveLength(4);
  expect(csv).toContain("Apr,Cardiology");
  expect(csv).not.toContain("Orthopedics");
});
test("contact form validates and reports email draft mode honestly", async ({
  page,
  request,
}) => {
  const response = await request.post("/api/contact", {
    data: {
      name: "Alex Morgan",
      email: "alex@example.org",
      message: "A test inquiry about a healthcare analytics project.",
      website: "",
      startedAt: Date.now() - 5000,
    },
  });
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ mode: "mailto" });
  await page.goto("/#contact");
  await page.getByLabel("Your name", { exact: true }).fill("Alex Morgan");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("alex@example.org");
  await page
    .getByLabel("What’s on your mind?", { exact: true })
    .fill("A test inquiry about a healthcare analytics project.");
  await page.waitForTimeout(1600);
  await page
    .getByRole("button", { name: "Let’s connect", exact: true })
    .click();
  await expect(page.locator(".form-feedback")).toContainText(
    "Your email draft is ready",
  );
  await expect(
    page.getByRole("link", { name: "Open email draft" }),
  ).toHaveAttribute(
    "href",
    /mailto:fayas818@gmail.com\?subject=Portfolio%20inquiry%20from%20Alex%20Morgan/,
  );
});
for (const theme of [
  "observatory",
  "clinical",
  "violet",
  "emerald",
  "contrast",
])
  test(`${theme} theme passes automated WCAG AA checks`, async ({ page }) => {
    await page.goto("/#lab");
    await expect(page.locator(".live-dashboard")).toBeVisible();
    await page.evaluate((t) => {
      document.documentElement.dataset.theme = t;
    }, theme);
    await page.waitForTimeout(400);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        description: v.description,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    ).toEqual([]);
  });

test("illustrated island visits all four destinations and resets discovery progress", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".world-mode")).toContainText("MAP EXPLORER");
  const dock = page.getByRole("navigation", { name: "Island destinations" });
  for (const [i, name] of [
    "Care Campus",
    "Neural Garden",
    "People Park",
    "Connected Cove",
  ].entries()) {
    await dock.getByRole("button", { name: new RegExp(name) }).click();
    await expect(
      page.getByRole("complementary", { name: `${name} destination` }),
    ).toBeVisible();
    await expect(page.locator(".world-passport strong")).toContainText(
      `${i + 1}`,
    );
  }
  await expect(page.locator(".world-project-panel a")).toHaveAttribute(
    "href",
    "/projects/connected-home",
  );
  await page.getByRole("button", { name: "Restart exploration" }).click();
  await expect(page.locator(".world-passport strong")).toContainText("0");
  await expect(page.locator(".world-project-panel")).toHaveCount(0);
});
test("project browser supports tabs, keyboard navigation and case-study links", async ({
  page,
}) => {
  await page.goto("/#work");
  await page.getByRole("tab", { name: /Neural Garden/ }).click();
  await expect(
    page.getByRole("tabpanel", { name: /Neural Garden/ }),
  ).toContainText("Finding patterns. Supporting care.");
  await expect(page.locator(".explorer-case-link")).toHaveAttribute(
    "href",
    "/projects/skin-cancer-detection",
  );
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tabpanel", { name: /People Park/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Next project", exact: true }).click();
  await expect(page.locator(".explorer-story")).toContainText(
    "Small signals. Connected systems.",
  );
});
test("3D island renders and keyboard driving moves the rover", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator(".world-mode")).toContainText(
    "INTERACTIVE 3D WORLD",
    { timeout: 30000 },
  );
  await expect(page.locator(".world-canvas-layer canvas")).toBeVisible();
  await page
    .getByRole("button", { name: "Take the wheel", exact: true })
    .click();
  const before = Number(
    await page.locator(".world-stage").getAttribute("data-rover-x"),
  );
  await page.keyboard.down("w");
  await page.waitForTimeout(1000);
  await page.keyboard.up("w");
  await page.waitForTimeout(400);
  const after = Number(
    await page.locator(".world-stage").getAttribute("data-rover-x"),
  );
  expect(after).toBeLessThan(before - 0.1);
  await page
    .getByRole("navigation", { name: "Island destinations" })
    .getByRole("button", { name: /People Park/ })
    .click();
  await expect(
    page.getByRole("complementary", { name: "People Park destination" }),
  ).toBeVisible();
  await expect(page.locator(".world-project-panel a")).toHaveAttribute(
    "href",
    "/projects/workforce-analytics",
  );
  await page.getByRole("button", { name: "Switch to accessible map" }).click();
  await expect(page.locator(".world-mode")).toContainText("MAP EXPLORER");
  expect(errors).toEqual([]);
});
