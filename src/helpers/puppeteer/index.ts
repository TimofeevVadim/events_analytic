import puppeteer from 'puppeteer';

import { onDelay } from '../main';

export const puppeteerLaunch = async ({ url, selector = '' }) => {
   try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });

    if(selector) {
        await puppeteerWaitForSelector({ page, selector })
    }

    console.log(`Браузер по урлу ${url} открыт`)
    
    return { page, browser }
   } catch (error) {
    console.log(`Не удалось открыть браузер по урлу ${url}`)

    return null
   }
}

export const puppeteerGetCurrentUrl = async ({ page }) => {
    try {
        const currentUrl = await page.url();

        return currentUrl
    } catch (error) {
        console.log(`Не удалось получить текущий урл`)

        return null
    }
}

export const puppeteerMoveToNewLink = async ({ page, url, waitingSelector = '', delay = 0 }) => {
    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        if(waitingSelector) {
            await puppeteerWaitForSelector({ page, selector: waitingSelector })
        }

        if(delay) {
            await onDelay(delay)
        }

        return url
    } catch (error) {
        console.log(`Не удалось открыть страницу по урлу ${url}`)

        return null
    }
}

export const puppeteerWaitForSelector = async ({ page, selector }) => {
    try {
        await page.waitForSelector(selector)
    } catch (error) {
        console.log(`Не удалось дождаться селектора ${selector}`)
    }
}

export const puppeteerBrowserClose = async ({ browser, url = '' }) => {
    try {
        await browser.close();

        console.log(`Браузер по урлу ${url} закрыт`)
    } catch (error) {
        console.log(error, 'Не удалось закрыть браузер')
    }
}

export const puppeteerGetFirstElement = async ({ page, selector }) => {
    try {
        const element = await page.$(selector)

        return element
    } catch (error) {
        console.log(`Не удалось получить элемент по селектору ${selector}`)

        return null
    }
}

export const puppeteerGetAllElements = async ({ page, selector }) => {
    try {
        const elements = await page.$$(selector)

        return elements
    } catch (error) {
        console.log(`Не удалось получить элементы по селектору ${selector}`)

        return null
    }
}

export const puppeteerClickToElement = async ({
    selector,
    page,
    block = null,
    waitForSelector = '',
    delay = 0,
    currentElement = null,
    message = true
 }) => {
    try {
        const element = currentElement
            || await puppeteerGetFirstElement({ page: block, selector })

        await element.click()

        if(waitForSelector) {
            await puppeteerWaitForSelector({ page, selector: waitForSelector })
        }

        if(delay) {
            await onDelay(delay)
        }

        if(message) {
            console.log(`Клик на элемент с селектором ${selector}`)
        }

        return element
    } catch (error) {
        console.log(`Не удалось выполнить клик на элемент с селектором ${selector}`)

        return null
    }
}

export const puppeteerEvaluate = async ({ element, property }) => {
    try {
        const value = await element.evaluate((el, prop) => el[prop], property);

        return value || null
    } catch (error) {
        console.log(`Не удалось выполнить evaluate со свойством ${property}`)

        return null
    }
}