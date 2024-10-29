"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoryResults = exports.getHistoryUrls = void 0;
const parser_1 = require("../../constants/parser");
const puppeteer_1 = require("../../helpers/puppeteer");
const getHistoryUrls = ({ data }) => {
    if (!data) {
        return [];
    }
    const urls = {};
    const sports = Object.keys(data);
    for (let index = 0; index < sports.length; index++) {
        const sport = sports[index];
        const history = data[sport];
        const sportData = {};
        const sportDataKeys = history?.data
            ? Object.keys(history?.data)
            : [];
        sportDataKeys.forEach(key => {
            const { url, time, names, name } = history.data[key];
            sportData[key] = {
                url,
                time,
                names,
                name
            };
        });
        urls[sport] = sportData;
    }
    return urls;
};
exports.getHistoryUrls = getHistoryUrls;
const getHistoryResults = async ({ data }) => {
    if (!data) {
        return null;
    }
    const results = {};
    const sports = Object.keys(data);
    const service = parser_1.SERVISES.FLASH_SCORE;
    const serviceUrl = parser_1.URLS[service].MATCH_URL;
    const { page, browser } = await (0, puppeteer_1.puppeteerLaunch)({ url: serviceUrl, selector: '' });
    let lastUrl = serviceUrl;
    for (let index = 0; index < sports.length; index++) {
        const sport = sports[index];
        const sportData = data[sport];
        const selectors = parser_1.SELECTORS[service][sport];
        const sportResults = {};
        const sportDataKeys = Object.keys(sportData);
        console.log(`Найдено ${sportDataKeys.length} матчей для ${sport}`);
        for (let index = 0; index < sportDataKeys.length; index++) {
            const eventName = sportDataKeys[index];
            const event = sportData[eventName];
            lastUrl = event?.url;
            const moveResult = await (0, puppeteer_1.puppeteerMoveToNewLink)({ page, url: lastUrl, delay: parser_1.DELAY.CLICK_TO_H2H });
            if (moveResult) {
                const resultsSelector = selectors.ELEMENTS.RESULTS;
                const results = await (0, puppeteer_1.puppeteerGetAllElements)({ page, selector: resultsSelector });
                if (results && results.length === 3) {
                    const home = await (0, puppeteer_1.puppeteerEvaluate)({ element: results[0], property: parser_1.PROPERTIES.TEXT_CONTENT });
                    const away = await (0, puppeteer_1.puppeteerEvaluate)({ element: results[2], property: parser_1.PROPERTIES.TEXT_CONTENT });
                    if (home && away) {
                        sportResults[eventName] = {
                            ...event,
                            results: {
                                home,
                                away
                            }
                        };
                        console.log(`${home}/${away}  `, lastUrl);
                    }
                    else {
                        console.log(`Не удалось получить результаты по урлу ${lastUrl}`);
                    }
                }
            }
            else {
                console.log(`Не удалось открыть ссылку ${lastUrl}`);
            }
        }
        results[sport] = sportResults;
    }
    await (0, puppeteer_1.puppeteerBrowserClose)({ browser, url: lastUrl });
    return results;
};
exports.getHistoryResults = getHistoryResults;
//# sourceMappingURL=parser-results.js.map