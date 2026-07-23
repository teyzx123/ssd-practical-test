// UI test over HTTP using Selenium WebDriver + a remote Chrome session.
// Verifies: home page loads, weak password is rejected, strong password reaches Welcome page.
import { Builder, By, until } from 'selenium-webdriver';

const SELENIUM_URL = process.env.SELENIUM_URL || 'http://localhost:4444/wd/hub';
const APP_URL = process.env.APP_URL || 'http://localhost/';

async function run() {
  const driver = await new Builder()
    .usingServer(SELENIUM_URL)
    .forBrowser('chrome')
    .build();

  try {
    // 1. Home page loads
    await driver.get(APP_URL);
    await driver.wait(until.elementLocated(By.css('h1')), 10000);
    const heading = await driver.findElement(By.css('h1')).getText();
    if (!/login/i.test(heading)) throw new Error(`Expected Login heading, got "${heading}"`);
    console.log('PASS: home page loaded with Login heading');

    // 2. Weak / breached password is rejected, stays on home page
    await driver.findElement(By.name('username')).sendKeys('testuser');
    await driver.findElement(By.name('password')).sendKeys('password123');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.elementLocated(By.css('h1')), 10000);
    const afterWeak = await driver.findElement(By.css('h1')).getText();
    if (!/login/i.test(afterWeak)) throw new Error('Weak password was not rejected');
    console.log('PASS: weak/breached password rejected, stayed on home page');

    // 3. Strong password reaches the Welcome page
    await driver.findElement(By.name('username')).clear();
    await driver.findElement(By.name('username')).sendKeys('testuser');
    await driver.findElement(By.name('password')).sendKeys('correct horse battery staple');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.elementLocated(By.css('h1')), 10000);
    const afterStrong = await driver.findElement(By.css('h1')).getText();
    if (!/welcome/i.test(afterStrong)) throw new Error('Strong password did not reach Welcome page');
    console.log('PASS: strong password reached Welcome page');

    console.log('ALL UI TESTS PASSED');
  } finally {
    await driver.quit();
  }
}

run().catch(err => {
  console.error('UI TEST FAILED:', err.message);
  process.exit(1);
});
