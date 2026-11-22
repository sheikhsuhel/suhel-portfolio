import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(process.env.BROWSER_TEST_MODULES + "/package.json");
const {chromium} = require("playwright-core");
const browser = await chromium.launch({executablePath:process.env.CHROME_PATH});
try {
  const page = await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await page.goto("http://127.0.0.1:4173/#ask-suhel-ai");
  const box = page.getByRole("textbox",{name:"Ask a recruiter question"});
  await box.fill("Explain the Olist project.");
  await box.press("Shift+Enter");
  assert.match(await box.inputValue(),/\n$/);
  await box.press("Enter");
  await page.getByText("Portfolio sources",{exact:true}).waitFor();
  await box.fill("What tools did you use?");
  await box.press("Enter");
  await page.locator(".answer-body p").filter({hasText:/Suhel used.*pivot tables/i}).waitFor();
  await page.getByRole("button",{name:"Retry",exact:true}).click();
  await page.getByRole("button",{name:"Retry",exact:true}).waitFor();
  assert.equal(await page.locator(".message-user").count(),2);
  await page.getByRole("button",{name:"Clear conversation"}).click();
  assert.equal(await page.locator(".message-user").count(),0);
  assert.equal(await page.getByRole("button",{name:"Send question"}).isDisabled(),true);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
  console.log("Mobile keyboard, follow-up, retry, reset and layout checks passed.");
} finally {await browser.close();}
