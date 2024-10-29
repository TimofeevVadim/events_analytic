export declare const puppeteerLaunch: ({ url, selector }: {
    url: any;
    selector?: string;
}) => Promise<{
    page: import("puppeteer").Page;
    browser: import("puppeteer").Browser;
}>;
export declare const puppeteerGetCurrentUrl: ({ page }: {
    page: any;
}) => Promise<any>;
export declare const puppeteerMoveToNewLink: ({ page, url, waitingSelector, delay }: {
    page: any;
    url: any;
    waitingSelector?: string;
    delay?: number;
}) => Promise<any>;
export declare const puppeteerWaitForSelector: ({ page, selector }: {
    page: any;
    selector: any;
}) => Promise<void>;
export declare const puppeteerBrowserClose: ({ browser, url }: {
    browser: any;
    url?: string;
}) => Promise<void>;
export declare const puppeteerGetFirstElement: ({ page, selector }: {
    page: any;
    selector: any;
}) => Promise<any>;
export declare const puppeteerGetAllElements: ({ page, selector }: {
    page: any;
    selector: any;
}) => Promise<any>;
export declare const puppeteerClickToElement: ({ selector, page, block, waitForSelector, delay, currentElement, message }: {
    selector: any;
    page: any;
    block?: any;
    waitForSelector?: string;
    delay?: number;
    currentElement?: any;
    message?: boolean;
}) => Promise<any>;
export declare const puppeteerEvaluate: ({ element, property }: {
    element: any;
    property: any;
}) => Promise<any>;
