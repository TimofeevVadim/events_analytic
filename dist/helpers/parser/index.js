"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDoubleChangeCoefficients = exports.getTotalCoefficients = exports.getBttsCoefficients = exports.getHistoryMatchResylt = exports.getHistoryMatchEvent = exports.getHistoryMatchDate = exports.getH2HTab = exports.getMatchTime = exports.getNames = exports.getCoefficients = exports.getMatchUrl = void 0;
const parser_1 = require("../../constants/parser");
const puppeteer_1 = require("../puppeteer");
const getMatchUrl = ({ id, service, tab }) => {
    if (!id) {
        return '';
    }
    switch (service) {
        case parser_1.SERVISES.FLASH_SCORE:
            const extracted = id.split('_').pop();
            return `${parser_1.URLS[service].MATCH_URL}${extracted}/${parser_1.TABS_URLS[service][tab]}`;
        default:
            return '';
    }
};
exports.getMatchUrl = getMatchUrl;
const getCoefficients = async ({ page, selectors, sport }) => {
    const oddsSelector = selectors.ELEMENTS.ODDS.WRAPPER;
    const coefficientSelector = selectors.ELEMENTS.ODDS.VALUE_INNER;
    const isFootbal = parser_1.SPORTS.FOOTBALL === sport;
    const odds = await (0, puppeteer_1.puppeteerGetFirstElement)({ page, selector: oddsSelector });
    const coefficients = await (0, puppeteer_1.puppeteerGetAllElements)({ page: odds, selector: coefficientSelector });
    const isCoefficientsNotFound = isFootbal
        ? coefficients?.length < 3
        : coefficients?.length < 2;
    if (!coefficients || isCoefficientsNotFound) {
        return null;
    }
    const property = parser_1.PROPERTIES.TEXT_CONTENT;
    const awayCoefficient = isFootbal
        ? coefficients[2]
        : coefficients[1];
    const home = await (0, puppeteer_1.puppeteerEvaluate)({ element: coefficients[0], property });
    const away = await (0, puppeteer_1.puppeteerEvaluate)({ element: awayCoefficient, property });
    return home && away
        ? { home, away }
        : null;
};
exports.getCoefficients = getCoefficients;
const getNames = async ({ page, selectors, sport }) => {
    const isTennis = parser_1.SPORTS.TENNIS === sport;
    const doublesSelector = selectors.ELEMENTS.DOUBLES;
    const property = parser_1.PROPERTIES.TEXT_CONTENT;
    const isDoubles = isTennis
        ? await (0, puppeteer_1.puppeteerGetFirstElement)({ page, selector: doublesSelector })
        : false;
    const nameSelector = isDoubles
        ? selectors.ELEMENTS.DOUBLES_NAME
        : selectors.ELEMENTS.NAME;
    const names = await (0, puppeteer_1.puppeteerGetAllElements)({ page, selector: nameSelector });
    if (isDoubles) {
        if (names.length < 4) {
            return null;
        }
        const homeFirst = await (0, puppeteer_1.puppeteerEvaluate)({ element: names[0], property });
        const homeSecond = await (0, puppeteer_1.puppeteerEvaluate)({ element: names[1], property });
        const awayFirst = await (0, puppeteer_1.puppeteerEvaluate)({ element: names[2], property });
        const awaySecond = await (0, puppeteer_1.puppeteerEvaluate)({ element: names[3], property });
        const home = `${homeFirst}/${homeSecond}`;
        const away = `${awayFirst}/${awaySecond}`;
        return home && away
            ? { home, away }
            : null;
    }
    const home = await (0, puppeteer_1.puppeteerEvaluate)({ element: names[0], property });
    const away = await (0, puppeteer_1.puppeteerEvaluate)({ element: names[1], property });
    return home && away
        ? { home, away }
        : null;
};
exports.getNames = getNames;
const getMatchTime = async ({ page, selectors }) => {
    const timeSelector = selectors.ELEMENTS.TIME;
    const property = parser_1.PROPERTIES.TEXT_CONTENT;
    const timeContainer = await (0, puppeteer_1.puppeteerGetFirstElement)({ page, selector: timeSelector });
    const time = await (0, puppeteer_1.puppeteerEvaluate)({ element: timeContainer, property });
    return time ? time : null;
};
exports.getMatchTime = getMatchTime;
const getH2HTab = async ({ page, selectors }) => {
    try {
        const selector = selectors.ELEMENTS.TABS;
        const tabs = await (0, puppeteer_1.puppeteerGetAllElements)({ page, selector });
        if (tabs.length < 3) {
            return null;
        }
        return tabs[2];
    }
    catch (error) {
        return null;
    }
};
exports.getH2HTab = getH2HTab;
const getHistoryMatchDate = async ({ section, selectors }) => {
    const selector = selectors.ELEMENTS.H2H.DATE;
    const property = parser_1.PROPERTIES.TEXT_CONTENT;
    const element = await (0, puppeteer_1.puppeteerGetFirstElement)({ page: section, selector });
    const date = await (0, puppeteer_1.puppeteerEvaluate)({ element, property });
    return date;
};
exports.getHistoryMatchDate = getHistoryMatchDate;
const getHistoryMatchEvent = async ({ section, selectors }) => {
    const selector = selectors.ELEMENTS.H2H.EVENT;
    const property = parser_1.PROPERTIES.TEXT_CONTENT;
    const element = await (0, puppeteer_1.puppeteerGetFirstElement)({ page: section, selector });
    const event = await (0, puppeteer_1.puppeteerEvaluate)({ element, property });
    return event;
};
exports.getHistoryMatchEvent = getHistoryMatchEvent;
const getHistoryMatchResylt = async ({ section, selectors, url, type }) => {
    const resultSelector = selectors.ELEMENTS.H2H.RESULT;
    const homeSelector = selectors.ELEMENTS.H2H.HOME_PARTICIPANT;
    const awaySelector = selectors.ELEMENTS.H2H.AWAY_PARTICIPANT;
    const property = parser_1.PROPERTIES.TEXT_CONTENT;
    const results = await (0, puppeteer_1.puppeteerGetAllElements)({ page: section, selector: resultSelector });
    if (!results && results.length < 2) {
        return null;
    }
    const homeResult = await (0, puppeteer_1.puppeteerEvaluate)({ element: results[0], property });
    const awayResult = await (0, puppeteer_1.puppeteerEvaluate)({ element: results[1], property });
    const homeParticipant = await (0, puppeteer_1.puppeteerGetFirstElement)({ page: section, selector: homeSelector });
    const awayParticipant = await (0, puppeteer_1.puppeteerGetFirstElement)({ page: section, selector: awaySelector });
    const homeName = await (0, puppeteer_1.puppeteerEvaluate)({ element: homeParticipant, property });
    const awayName = await (0, puppeteer_1.puppeteerEvaluate)({ element: awayParticipant, property });
    if (!homeResult || !awayResult || !homeName || !awayName) {
        console.log({
            homeResult,
            awayResult,
            homeName,
            awayName
        }, `Не удалось собрать данные матча ${url} для ${type}`);
        return null;
    }
    return {
        home: {
            name: homeName,
            result: Number(homeResult),
            isWiner: Number(homeResult) > Number(awayResult)
        },
        away: {
            name: awayName,
            result: Number(awayResult),
            isWiner: Number(awayResult) > Number(homeResult)
        }
    };
};
exports.getHistoryMatchResylt = getHistoryMatchResylt;
const getBttsCoefficients = async ({ page, selectors }) => {
    const constainerSelector = selectors.ELEMENTS.BTTS.ROW;
    const bttsValueSelector = selectors.ELEMENTS.BTTS.VALUE;
    const container = await (0, puppeteer_1.puppeteerGetFirstElement)({ page, selector: constainerSelector });
    if (!container) {
        return null;
    }
    const bttsCoefficients = await (0, puppeteer_1.puppeteerGetAllElements)({ page: container, selector: bttsValueSelector });
    if (bttsCoefficients && bttsCoefficients.length === 2) {
        const yes = await (0, puppeteer_1.puppeteerEvaluate)({ element: bttsCoefficients[0], property: parser_1.PROPERTIES.TEXT_CONTENT });
        const no = await (0, puppeteer_1.puppeteerEvaluate)({ element: bttsCoefficients[1], property: parser_1.PROPERTIES.TEXT_CONTENT });
        return yes && no
            ? [yes, no]
            : [];
    }
    return null;
};
exports.getBttsCoefficients = getBttsCoefficients;
const getTotalCoefficients = async ({ page, selectors }) => {
    const constainerSelector = selectors.CONTAINERS.TOTAL_ODDS;
    const totalRowSelector = selectors.ELEMENTS.TOTAL.ROW;
    const totalSelector = selectors.ELEMENTS.TOTAL.TOTAL;
    const totalValueSelector = selectors.ELEMENTS.TOTAL.VALUE;
    const totalItems = [];
    const totals = {};
    const containers = await (0, puppeteer_1.puppeteerGetAllElements)({ page, selector: constainerSelector });
    if (!containers || !containers.length) {
        return null;
    }
    for (let index = 0; index < containers.length; index++) {
        const container = containers[index];
        const totalItem = await (0, puppeteer_1.puppeteerGetFirstElement)({ page: container, selector: totalRowSelector });
        if (totalItem) {
            totalItems.push(totalItem);
        }
    }
    for (let index = 0; index < totalItems.length; index++) {
        const totalItemRow = totalItems[index];
        const totalItem = await (0, puppeteer_1.puppeteerGetFirstElement)({ page: totalItemRow, selector: totalSelector });
        const totalCoefficients = await (0, puppeteer_1.puppeteerGetAllElements)({ page: totalItemRow, selector: totalValueSelector });
        if (totalItem && totalCoefficients?.length === 2) {
            const total = await (0, puppeteer_1.puppeteerEvaluate)({ element: totalItem, property: parser_1.PROPERTIES.TEXT_CONTENT });
            const more = await (0, puppeteer_1.puppeteerEvaluate)({ element: totalCoefficients[0], property: parser_1.PROPERTIES.TEXT_CONTENT });
            const less = await (0, puppeteer_1.puppeteerEvaluate)({ element: totalCoefficients[1], property: parser_1.PROPERTIES.TEXT_CONTENT });
            if (total && more && less) {
                totals[total] = [more, less];
            }
        }
    }
    return totals;
};
exports.getTotalCoefficients = getTotalCoefficients;
const getDoubleChangeCoefficients = async ({ page, selectors }) => {
    const constainerSelector = selectors.ELEMENTS.DOUBLE_CHANGE.ROW;
    const doubleChangeValueSelector = selectors.ELEMENTS.DOUBLE_CHANGE.VALUE;
    const container = await (0, puppeteer_1.puppeteerGetFirstElement)({ page, selector: constainerSelector });
    if (!container) {
        return null;
    }
    const doubleChangeCoefficients = await (0, puppeteer_1.puppeteerGetAllElements)({ page: container, selector: doubleChangeValueSelector });
    if (doubleChangeCoefficients && doubleChangeCoefficients.length === 3) {
        const first = await (0, puppeteer_1.puppeteerEvaluate)({ element: doubleChangeCoefficients[0], property: parser_1.PROPERTIES.TEXT_CONTENT });
        const second = await (0, puppeteer_1.puppeteerEvaluate)({ element: doubleChangeCoefficients[1], property: parser_1.PROPERTIES.TEXT_CONTENT });
        const third = await (0, puppeteer_1.puppeteerEvaluate)({ element: doubleChangeCoefficients[2], property: parser_1.PROPERTIES.TEXT_CONTENT });
        return first && second && third
            ? [first, second, third]
            : [];
    }
    return null;
};
exports.getDoubleChangeCoefficients = getDoubleChangeCoefficients;
//# sourceMappingURL=index.js.map