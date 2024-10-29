"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoryData = exports.getH2hHistory = exports.clickToLeagueShowMore = exports.clickToShowMore = exports.onClickToH2H = exports.onSwitchToTomorrow = exports.getOtherCoefficients = exports.parseMatchData = exports.processingAvailableMatches = exports.getMatchUrls = exports.getSportItems = exports.getParsedSportData = void 0;
const parser_1 = require("../../constants/parser");
const parser_2 = require("../../helpers/parser");
const puppeteer_1 = require("../../helpers/puppeteer");
const date_1 = require("../../helpers/date");
const getParsedSportData = async ({ sport, isFirstHalfOfDay }) => {
    const service = parser_1.SERVISES.FLASH_SCORE;
    const selectors = parser_1.SELECTORS[service][sport];
    const url = parser_1.URLS[service][sport];
    const waitingSelector = selectors.WAITING_TO_LOAD.FIRST_BOOT;
    const { page, browser } = await (0, puppeteer_1.puppeteerLaunch)({ url, selector: waitingSelector });
    const items = await (0, exports.getSportItems)({ selectors, page, isFirstHalfOfDay });
    console.log(`Всего найдено ${items.length} матчей для ${sport}`);
    const matchUrls = await (0, exports.getMatchUrls)({ items, service, selectors, isFirstHalfOfDay });
    console.log(`На следующую половину дня найдено ${matchUrls.length} матчей для ${sport}`);
    const { data, failedUrls } = await (0, exports.processingAvailableMatches)({ items: matchUrls, page, selectors, sport, service });
    await (0, puppeteer_1.puppeteerBrowserClose)({ browser, url });
    return { data, failedUrls };
};
exports.getParsedSportData = getParsedSportData;
const getSportItems = async ({ selectors, page, isFirstHalfOfDay }) => {
    const clickResult = !isFirstHalfOfDay
        ? await (0, exports.onSwitchToTomorrow)({ page, selectors })
        : null;
    if (!isFirstHalfOfDay && !clickResult) {
        return [];
    }
    const mainSelector = selectors.CONTAINERS.ITEMS;
    const mainContainer = await (0, puppeteer_1.puppeteerGetFirstElement)({ page, selector: mainSelector });
    if (!mainContainer) {
        return [];
    }
    const showMoreLeagueSelector = selectors.BUTTONS.LEAGUE_SHOW_MORE;
    const showMoreLeagueItems = await (0, puppeteer_1.puppeteerGetAllElements)({ page: mainContainer, selector: showMoreLeagueSelector });
    if (showMoreLeagueItems?.length) {
        await (0, exports.clickToLeagueShowMore)({ page, elements: showMoreLeagueItems, selectors });
    }
    const itemSelector = selectors.ELEMENTS.ITEM;
    const items = await (0, puppeteer_1.puppeteerGetAllElements)({ page: mainContainer, selector: itemSelector });
    return items;
};
exports.getSportItems = getSportItems;
const getMatchUrls = async ({ items, service, selectors, isFirstHalfOfDay }) => {
    const property = parser_1.PROPERTIES.ID;
    const tab = parser_1.TABS.H2H;
    const urls = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const timeSelector = selectors.ELEMENTS.EVENT_TIME;
        const stageSelector = selectors.ELEMENTS.EVENT_STAGE;
        const stageBlock = await (0, puppeteer_1.puppeteerGetFirstElement)({ page: item, selector: stageSelector });
        const timeBlock = !stageBlock
            ? await (0, puppeteer_1.puppeteerGetFirstElement)({ page: item, selector: timeSelector })
            : null;
        const time = timeBlock
            ? await (0, puppeteer_1.puppeteerEvaluate)({ element: timeBlock, property: parser_1.PROPERTIES.TEXT_CONTENT })
            : null;
        const isMorningEvent = time
            ? (0, date_1.getIsFirstHalfOfDay)(time)
            : null;
        const isRightEvent = isMorningEvent !== isFirstHalfOfDay;
        const id = await (0, puppeteer_1.puppeteerEvaluate)({ element: item, property });
        const url = (0, parser_2.getMatchUrl)({ id, service, tab });
        if (url && !stageBlock && isRightEvent) {
            urls.push({ id, url });
        }
    }
    return urls;
};
exports.getMatchUrls = getMatchUrls;
const processingAvailableMatches = async ({ items, page, selectors, sport, service }) => {
    const waitingSelector = selectors.WAITING_TO_LOAD.MATCH_PAGE;
    const failedUrls = [];
    let data = {};
    for (let i = 0; i < items.length; i++) {
        const { id, url } = items[i];
        const isPageMove = await (0, puppeteer_1.puppeteerMoveToNewLink)({ page, url, waitingSelector });
        if (isPageMove) {
            const matchData = await (0, exports.parseMatchData)({ page, selectors, url, sport, id, service });
            if (matchData) {
                console.log(`Получены данные для ${i} из ${items.length} матчей ${sport}`);
                data[matchData.name] = matchData;
            }
        }
        else {
            failedUrls.push(url);
        }
    }
    if (failedUrls.length) {
        console.log(`Остался список не открытых урлов, в количестве ${failedUrls.length}`);
    }
    return { data, failedUrls };
};
exports.processingAvailableMatches = processingAvailableMatches;
const parseMatchData = async ({ page, selectors, url, sport, id, service }) => {
    const coefficients = await (0, parser_2.getCoefficients)({ page, selectors, sport });
    if (!coefficients) {
        return null;
    }
    const names = await (0, parser_2.getNames)({ page, selectors, sport });
    const time = await (0, parser_2.getMatchTime)({ page, selectors });
    console.log(time, 'time');
    if (!names || !time) {
        return null;
    }
    const clickH2HResult = await (0, exports.onClickToH2H)({ page, selectors });
    if (!clickH2HResult) {
        return null;
    }
    await (0, exports.clickToShowMore)({ page, selectors });
    const history = await (0, exports.getH2hHistory)({ page, selectors, url });
    if (!history) {
        return null;
    }
    const otherCoefficients = await (0, exports.getOtherCoefficients)({ id, page, selectors, sport, service });
    return {
        name: `${names.home}/${names.away}`,
        url,
        coefficients,
        otherCoefficients,
        names,
        time,
        home: history.home,
        away: history.away,
        games: history.games
    };
};
exports.parseMatchData = parseMatchData;
const getOtherCoefficients = async ({ id, page, selectors, sport, service }) => {
    if (![parser_1.SPORTS.FOOTBALL].includes(sport)) {
        return null;
    }
    const otherCoefficients = {};
    const tabs = parser_1.OTHER_TABS[sport];
    for (let index = 0; index < tabs.length; index++) {
        const tab = tabs[index];
        const url = (0, parser_2.getMatchUrl)({ id, service, tab });
        const moveResult = await (0, puppeteer_1.puppeteerMoveToNewLink)({ page, url, delay: 500 });
        const currentUrl = await (0, puppeteer_1.puppeteerGetCurrentUrl)({ page });
        const isPageMove = moveResult
            && currentUrl === url;
        if (isPageMove && tab === parser_1.TABS.BTTS) {
            otherCoefficients[tab] = await (0, parser_2.getBttsCoefficients)({ page, selectors });
        }
        if (isPageMove && tab === parser_1.TABS.TOTAL) {
            otherCoefficients[tab] = await (0, parser_2.getTotalCoefficients)({ page, selectors });
        }
        if (isPageMove && tab === parser_1.TABS.DOUBLE_CHANGE) {
            otherCoefficients[tab] = await (0, parser_2.getDoubleChangeCoefficients)({ page, selectors });
        }
    }
    return otherCoefficients;
};
exports.getOtherCoefficients = getOtherCoefficients;
const onSwitchToTomorrow = async ({ page, selectors }) => {
    const buttonSelector = selectors.BUTTONS.TOMORROW;
    const calendarSelector = selectors.ELEMENTS.CALENDAR;
    const waitForSelector = selectors.WAITING_TO_LOAD.CLICK_TO_TOMORROW;
    const delay = parser_1.DELAY.CLICK_TO_TOMOROW;
    const block = await (0, puppeteer_1.puppeteerGetFirstElement)({ page, selector: calendarSelector });
    const clickResult = await (0, puppeteer_1.puppeteerClickToElement)({
        selector: buttonSelector,
        waitForSelector,
        block,
        page,
        delay
    });
    return clickResult;
};
exports.onSwitchToTomorrow = onSwitchToTomorrow;
const onClickToH2H = async ({ page, selectors }) => {
    const buttonSelector = selectors.BUTTONS.H2H.TAB;
    const waitForSelector = selectors.WAITING_TO_LOAD.H2H;
    const delay = parser_1.DELAY.CLICK_TO_H2H;
    const block = await (0, parser_2.getH2HTab)({ page, selectors });
    const clickH2HResult = await (0, puppeteer_1.puppeteerClickToElement)({
        selector: buttonSelector,
        waitForSelector,
        block,
        page,
        delay,
        message: false
    });
    return clickH2HResult;
};
exports.onClickToH2H = onClickToH2H;
const clickToShowMore = async ({ page, selectors }) => {
    const sectionsSelector = selectors.CONTAINERS.H2H.SECTIONS;
    const buttonSelectors = selectors.BUTTONS.H2H.SHOW_MORE;
    const buttonSelector = selectors.BUTTONS.H2H.SHOW_MORE_BTN;
    const delay = parser_1.DELAY.CLICK_TO_SHOW_MORE;
    for (let i = 0; i < parser_1.MAX_CLICK_TO_SHOW_MORE; i++) {
        const sections = await (0, puppeteer_1.puppeteerGetAllElements)({ page, selector: sectionsSelector });
        const buttons = await (0, puppeteer_1.puppeteerGetAllElements)({ page, selector: buttonSelectors });
        if (!buttons?.length) {
            i = parser_1.MAX_CLICK_TO_SHOW_MORE;
        }
        for (let index = 0; index < sections.length; index++) {
            const section = sections[index];
            const button = await (0, puppeteer_1.puppeteerGetFirstElement)({ page: section, selector: buttonSelector });
            if (button) {
                await (0, puppeteer_1.puppeteerClickToElement)({
                    selector: buttonSelector,
                    currentElement: button,
                    page,
                    delay,
                    message: false
                });
            }
        }
    }
};
exports.clickToShowMore = clickToShowMore;
const clickToLeagueShowMore = async ({ page, elements, selectors }) => {
    const buttonSelector = selectors.BUTTONS.LEAGUE_SHOW_MORE;
    const delay = 1500;
    for (let index = 0; index < elements.length; index++) {
        const button = elements[index];
        await (0, puppeteer_1.puppeteerClickToElement)({
            selector: buttonSelector,
            currentElement: button,
            page,
            delay,
            message: false
        });
    }
};
exports.clickToLeagueShowMore = clickToLeagueShowMore;
const getH2hHistory = async ({ page, selectors, url }) => {
    const sectionRows = selectors.CONTAINERS.H2H.SECTION_ROWS;
    const sections = await (0, puppeteer_1.puppeteerGetAllElements)({ page, selector: sectionRows });
    if (sections.length < 3) {
        return null;
    }
    const homeHistory = await (0, exports.getHistoryData)({ section: sections[parser_1.H2H_SECTION_INDEX.HOME], selectors, url, type: parser_1.H2H_TYPES.HOME });
    const awayHistory = await (0, exports.getHistoryData)({ section: sections[parser_1.H2H_SECTION_INDEX.AWAY], selectors, url, type: parser_1.H2H_TYPES.AWAY });
    const gamesHistory = await (0, exports.getHistoryData)({ section: sections[parser_1.H2H_SECTION_INDEX.GAME], selectors, url, type: parser_1.H2H_TYPES.GAMES });
    if (!homeHistory.length || !awayHistory.length) {
        return null;
    }
    return {
        home: homeHistory,
        away: awayHistory,
        games: gamesHistory
    };
};
exports.getH2hHistory = getH2hHistory;
const getHistoryData = async ({ section, selectors, url, type }) => {
    const currentDate = (0, date_1.getCurrentDateFormatted)();
    const h2hRow = selectors.ELEMENTS.H2H.ROW;
    const items = await (0, puppeteer_1.puppeteerGetAllElements)({ page: section, selector: h2hRow });
    const history = [];
    for (let i = 0; i < items.length; i++) {
        const match = items[i];
        const date = await (0, parser_2.getHistoryMatchDate)({ section: match, selectors });
        const isCurrentMatch = false;
        const event = await (0, parser_2.getHistoryMatchEvent)({ section: match, selectors });
        const result = await (0, parser_2.getHistoryMatchResylt)({ section: match, selectors, url, type });
        if (!isCurrentMatch && date && event && result) {
            const name = `${result.home.name}/${result.away.name}`;
            const data = {
                name,
                date,
                event,
                ...result
            };
            history.push(data);
        }
        else if (isCurrentMatch) {
            console.log(`Матч не добавлен в историю так как он прошел сегодня ${url}`);
        }
        else {
            console.log({ date, event, result }, `Не удалось собрать данные для матча ${url}`);
        }
    }
    return history;
};
exports.getHistoryData = getHistoryData;
//# sourceMappingURL=parser-history.js.map