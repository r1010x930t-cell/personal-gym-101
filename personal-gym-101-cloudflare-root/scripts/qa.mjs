import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

const base = "http://localhost:3000";
const out = "/home/ubuntu/webdev-static-assets/komorebi";
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", e => errors.push(e.message));
const results = [];
function record(name) {
  results.push(name);
  console.log(`PASS: ${name}`);
}
try {
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.locator("h1").waitFor();
  assert.match(await page.title(), /パーソナルジム101/);
  assert.equal(await page.locator("h1").count(), 1);
  await page.locator(".hero-visual img").evaluate(img => img.decode());
  assert.match(await page.locator(".hero-visual img").getAttribute("src"), /hero-gym_/);
  assert.equal(await page.locator(".hero-image-note").count(), 0);
  await page.screenshot({ path: `${out}/qa-desktop.png`, fullPage: false });
  record("Desktop render and title");
  assert.equal(await page.locator("#trainer").count(), 1);
  assert.match(await page.locator("#trainer").innerText(), /MEET YOUR TRAINER/);
  assert.equal(await page.locator("#trainer img").count(), 2);
  assert.match(await page.locator("#trainer").innerText(), /宮間（みやま）/);
  assert.match(await page.locator("#trainer").innerText(), /橋本（はしもと）/);
  assert.match(await page.locator("#features").innerText(), /リラクゼーション/);
  assert.match(await page.locator("#trainer").innerText(), /ケア・リラクゼーション/);
  assert.match(await page.locator("#concept").innerText(), /変わった自分に会える場所へ/);
  assert.match(await page.locator("#concept").innerText(), /一生モノの身体の土台/);
  assert.match(await page.locator("#access").innerText(), /〒297-0024 千葉県茂原市八千代1-3-11/);
  assert.match(await page.locator("#access").innerText(), /8:00〜21:00/);
  assert.match(await page.locator("#access").innerText(), /不定休・完全予約制/);
  assert.equal(
    await page.getByText("木の温もりと、やわらかな光に包まれる。", { exact: false }).count(),
    0
  );
  await page.locator("#trainer img").evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
  assert(await page.locator('a[href="#trainer"]').count() >= 1);
  await page.locator("#trainer").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${out}/qa-trainer.png`, fullPage: false });
  record("Trainer section, photo and navigation");
  for (const width of [1440, 1280, 1024, 768, 640, 390, 375]) {
    await page.setViewportSize({ width, height: 900 });
    const dimensions = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      viewport: innerWidth,
    }));
    assert(
      dimensions.scroll <= dimensions.viewport,
      `${width}px overflow: ${JSON.stringify(dimensions)}`
    );
  }
  record("No horizontal overflow at seven desktop/tablet/mobile widths");
  await page.setViewportSize({ width: 1440, height: 1000 });
  assert.equal(await page.getByText("回数券プラン", { exact: true }).count(), 0);
  assert.equal(await page.locator("#price-panel .plan-card").count(), 3);
  assert.match(await page.locator("#price-panel").innerText(), /月2回/);
  assert.match(await page.locator("#price-panel").innerText(), /33,000/);
  await page
    .getByRole("button", { name: "このプランで相談する" })
    .nth(1)
    .click();
  assert.match(await page.locator(".selected-plan").innerText(), /Standard/);
  record("Monthly pricing only and correct plan passed to booking dialog");
  await page.getByRole("button", { name: "入力内容を確認する" }).click();
  assert.equal(await page.locator("input:invalid").count(), 3);
  record("Required form fields reject empty submission");
  await page.getByLabel("お名前").fill("テスト 花子");
  await page.getByLabel("メールアドレス").fill("test@example.com");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const date = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
  await page.getByLabel("体験の希望日").fill("2020-01-01");
  await page.getByRole("button", { name: "入力内容を確認する" }).click();
  assert.equal(
    await page
      .getByLabel("体験の希望日")
      .evaluate(input => input.validity.rangeUnderflow),
    true
  );
  await page.getByLabel("体験の希望日").fill(date);
  await page.getByLabel("ご希望の時間帯").selectOption("午後（12:00〜17:00）");
  await page.getByRole("button", { name: "入力内容を確認する" }).click();
  assert.match(
    await page.locator(".booking-review").innerText(),
    /テスト 花子/
  );
  assert.match(await page.locator(".booking-review").innerText(), /Standard/);
  await page.getByRole("button", { name: "入力内容を修正する" }).click();
  assert.equal(await page.getByLabel("お名前").inputValue(), "テスト 花子");
  await page.getByRole("button", { name: "入力内容を確認する" }).click();
  await page.getByRole("button", { name: "デモを完了する" }).click();
  assert.match(
    await page.locator(".booking-done").innerText(),
    /実際の予約受付は、現在準備中です/
  );
  await page.getByRole("button", { name: "ホームページに戻る" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  record("Date validation, form review, editing and explicit demo completion");
  await page
    .getByRole("button", { name: "体験レッスンを予約", exact: true })
    .click();
  assert.equal(await page.getByLabel("お名前").inputValue(), "");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  record("Closing the form clears personal input");
  await page
    .getByRole("button", { name: /運動が苦手で、ジムも初めて/ })
    .click();
  assert.equal(
    await page
      .getByRole("button", { name: /運動が苦手で、ジムも初めて/ })
      .getAttribute("aria-expanded"),
    "true"
  );
  assert(
    await page
      .getByText("もちろんです。まずは今の体力や普段の過ごし方", {
        exact: false,
      })
      .isVisible()
  );
  await page
    .getByRole("button", { name: /運動が苦手で、ジムも初めて/ })
    .click();
  record("FAQ accordion expands and collapses");
  await page
    .getByRole("button", { name: "プライバシーについて", exact: true })
    .click();
  assert.match(
    await page.getByRole("dialog").innerText(),
    /入力内容は消去されます/
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.locator(".news-strip button").click();
  assert.match(
    await page.getByRole("dialog").innerText(),
    /2026年12月にオープン/
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  record("News and privacy dialogs");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
  });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.screenshot({ path: `${out}/qa-mobile.png`, fullPage: false });
  await page.getByRole("button", { name: "メニューを開く" }).click();
  await page
    .getByRole("navigation", { name: "モバイルナビゲーション" })
    .getByRole("link", { name: "プログラム・料金" })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  assert.equal(new URL(page.url()).hash, "#plans");
  record("Mobile menu navigation");
  await page.locator(".plan-card").first().scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `${out}/qa-mobile-plans.png`,
    fullPage: false,
  });
  await page.locator(".plan-card").first().getByRole("button").click();
  const box = await page.getByRole("dialog").boundingBox();
  assert(box.x >= 0 && box.x + box.width <= 390, "Mobile dialog fits viewport");
  await page.screenshot({ path: `${out}/qa-mobile-form.png`, fullPage: false });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  record("Mobile pricing and booking dialog fit viewport");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator("#concept").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${out}/qa-concept.png`, fullPage: false });
  await page.locator("#plans").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${out}/qa-pricing.png`, fullPage: false });
  const imageStatus = await page.locator("img").evaluateAll(imgs =>
    imgs.map(img => ({
      src: img.src,
      loaded: img.complete && img.naturalWidth > 0,
    }))
  );
  assert(
    imageStatus.every(img => img.loaded),
    JSON.stringify(imageStatus)
  );
  record("All website images load successfully");
  assert.equal(errors.length, 0, errors.join("\n"));
  record("No browser JavaScript errors");
  await fs.writeFile(
    `${out}/test-results.json`,
    JSON.stringify({ passed: results, errors }, null, 2)
  );
} finally {
  await browser.close();
}
