"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.puppeteerEvaluate = exports.puppeteerClickToElement = exports.puppeteerGetAllElements = exports.puppeteerGetFirstElement = exports.puppeteerBrowserClose = exports.puppeteerWaitForSelector = exports.puppeteerMoveToNewLink = exports.puppeteerGetCurrentUrl = exports.puppeteerLaunch = void 0;
const puppeteer_1 = require("puppeteer");
const main_1 = require("../main");
const puppeteerLaunch = async ({ url, selector = '' }) => {
    try {
        const browser = await puppeteer_1.default.launch();
        const page = await browser.newPage();
        await page.goto(url);
        await page.setViewport({ width: 1080, height: 1024 });
        if (selector) {
            await (0, exports.puppeteerWaitForSelector)({ page, selector });
        }
        console.log(`Браузер по урлу ${url} открыт`);
        return { page, browser };
    }
    catch (error) {
        console.log(`Не удалось открыть браузер по урлу ${url}`);
        return null;
    }
};
exports.puppeteerLaunch = puppeteerLaunch;
const puppeteerGetCurrentUrl = async ({ page }) => {
    try {
        const currentUrl = await page.url();
        return currentUrl;
    }
    catch (error) {
        console.log(`Не удалось получить текущий урл`);
        return null;
    }
};
exports.puppeteerGetCurrentUrl = puppeteerGetCurrentUrl;
const puppeteerMoveToNewLink = async ({ page, url, waitingSelector = '', delay = 0 }) => {
    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        if (waitingSelector) {
            await (0, exports.puppeteerWaitForSelector)({ page, selector: waitingSelector });
        }
        if (delay) {
            await (0, main_1.onDelay)(delay);
        }
        return url;
    }
    catch (error) {
        console.log(`Не удалось открыть страницу по урлу ${url}`);
        return null;
    }
};
exports.puppeteerMoveToNewLink = puppeteerMoveToNewLink;
const puppeteerWaitForSelector = async ({ page, selector }) => {
    try {
        await page.waitForSelector(selector);
    }
    catch (error) {
        console.log(`Не удалось дождаться селектора ${selector}`);
    }
};
exports.puppeteerWaitForSelector = puppeteerWaitForSelector;
const puppeteerBrowserClose = async ({ browser, url = '' }) => {
    try {
        await browser.close();
        console.log(`Браузер по урлу ${url} закрыт`);
    }
    catch (error) {
        console.log(error, 'Не удалось закрыть браузер');
    }
};
exports.puppeteerBrowserClose = puppeteerBrowserClose;
const puppeteerGetFirstElement = async ({ page, selector }) => {
    try {
        const element = await page.$(selector);
        return element;
    }
    catch (error) {
        console.log(`Не удалось получить элемент по селектору ${selector}`);
        return null;
    }
};
exports.puppeteerGetFirstElement = puppeteerGetFirstElement;
const puppeteerGetAllElements = async ({ page, selector }) => {
    try {
        const elements = await page.$$(selector);
        return elements;
    }
    catch (error) {
        console.log(`Не удалось получить элементы по селектору ${selector}`);
        return null;
    }
};
exports.puppeteerGetAllElements = puppeteerGetAllElements;
const puppeteerClickToElement = async ({ selector, page, block = null, waitForSelector = '', delay = 0, currentElement = null, message = true }) => {
    try {
        const element = currentElement
            || await (0, exports.puppeteerGetFirstElement)({ page: block, selector });
        await element.click();
        if (waitForSelector) {
            await (0, exports.puppeteerWaitForSelector)({ page, selector: waitForSelector });
        }
        if (delay) {
            await (0, main_1.onDelay)(delay);
        }
        if (message) {
            console.log(`Клик на элемент с селектором ${selector}`);
        }
        return element;
    }
    catch (error) {
        console.log(`Не удалось выполнить клик на элемент с селектором ${selector}`);
        return null;
    }
};
exports.puppeteerClickToElement = puppeteerClickToElement;
const puppeteerEvaluate = async ({ element, property }) => {
    try {
        const value = await element.evaluate((el, prop) => el[prop], property);
        return value || null;
    }
    catch (error) {
        console.log(`Не удалось выполнить evaluate со свойством ${property}`);
        return null;
    }
};
exports.puppeteerEvaluate = puppeteerEvaluate;
//# sourceMappingURL=index.js.map