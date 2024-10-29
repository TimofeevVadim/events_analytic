"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMissedPoints = exports.getIsSimilarLeagues = exports.sumHomeAwayMatchesForLeague = exports.getResults = exports.getMatchResult = exports.getFinalList = exports.customSort = exports.getNewFinalResult = exports.getFinalResult = exports.getAllPoints = exports.getWinnersRaiting = exports.getRivalsRaiting = exports.calculateAverage = exports.getPercentageProportion = exports.getCommonRivals = exports.getCounts = exports.getRivals = exports.getWinners = exports.cleanTeamName = void 0;
const analytics_1 = require("../../constants/analytics");
const parser_1 = require("../../constants/parser");
const puppeteer_1 = require("../puppeteer");
const cleanTeamName = (name) => {
    return name.replace(/\s*\(.*?\)\s*/g, '').trim();
};
exports.cleanTeamName = cleanTeamName;
const getWinners = ({ games, sport, name, gamesCount }) => {
    return games.slice(0, gamesCount).filter(game => {
        const { away, home } = game;
        const homeName = (0, exports.cleanTeamName)(home.name);
        const awayName = (0, exports.cleanTeamName)(away.name);
        const mainName = (0, exports.cleanTeamName)(name);
        return (homeName === mainName && home.isWiner)
            || (awayName === mainName && away.isWiner);
    });
};
exports.getWinners = getWinners;
const getRivals = ({ games, team }) => {
    const rivals = [];
    games.forEach(game => {
        if (game.home.name === team) {
            rivals.push(game.away.name);
        }
        if (game.away.name === team) {
            rivals.push(game.home.name);
        }
    });
    return rivals;
};
exports.getRivals = getRivals;
const getCounts = ({ games, team, isMissed = false }) => {
    let counts = 0;
    games.forEach(game => {
        if (!isMissed && game.home.name === team) {
            counts = counts + Number(game.home.result);
        }
        if (!isMissed && game.away.name === team) {
            counts = counts + Number(game.away.result);
        }
        if (isMissed && game.home.name !== team) {
            counts = counts + Number(game.home.result);
        }
        if (isMissed && game.away.name !== team) {
            counts = counts + Number(game.away.result);
        }
    });
    return counts;
};
exports.getCounts = getCounts;
const getCommonRivals = ({ home, away, homeName, awayName }) => {
    const homeRivals = (0, exports.getRivals)({ games: home, team: homeName });
    const awayRivals = (0, exports.getRivals)({ games: away, team: awayName });
    const intersections = homeRivals.filter(rival => awayRivals.includes(rival));
    return [...new Set(intersections)];
};
exports.getCommonRivals = getCommonRivals;
const getPercentageProportion = (a, b) => {
    if (!Number(b)) {
        return 100;
    }
    if (!Number(a)) {
        return 0;
    }
    const total = Number(a) + Number(b);
    const proportion = (a / total) * 100;
    return Number(proportion.toFixed(2));
};
exports.getPercentageProportion = getPercentageProportion;
const calculateAverage = (numbers) => {
    const total = numbers.reduce((sum, number) => sum + number, 0);
    const average = total
        ? total / numbers.length
        : 0;
    return Number(average.toFixed(2));
};
exports.calculateAverage = calculateAverage;
const getRivalsRaiting = ({ games, rivals }) => {
    const raitings = [];
    games.forEach(game => {
        if (rivals.includes(game.home.name)) {
            raitings.push((0, exports.getPercentageProportion)(game.away.result, game.home.result));
        }
        if (rivals.includes(game.away.name)) {
            raitings.push((0, exports.getPercentageProportion)(game.home.result, game.away.result));
        }
    });
    return (0, exports.calculateAverage)(raitings);
};
exports.getRivalsRaiting = getRivalsRaiting;
const getWinnersRaiting = ({ homeGames, awayGames }) => {
    const homeProportion = (0, exports.getPercentageProportion)(homeGames.length, awayGames.length);
    const awayProportion = (0, exports.getPercentageProportion)(awayGames.length, homeGames.length);
    return { home: homeProportion, away: awayProportion };
};
exports.getWinnersRaiting = getWinnersRaiting;
const getAllPoints = ({ home, away, homeName, awayName }) => {
    const minGamesCount = Math.min(home.length, away.length);
    const homeCounts = (0, exports.getCounts)({ games: home.slice(0, minGamesCount), team: homeName });
    const awayCounts = (0, exports.getCounts)({ games: away.slice(0, minGamesCount), team: awayName });
    const homeProportion = (0, exports.getPercentageProportion)(homeCounts, awayCounts);
    const awayProportion = (0, exports.getPercentageProportion)(awayCounts, homeCounts);
    return { home: homeProportion, away: awayProportion };
};
exports.getAllPoints = getAllPoints;
const getFinalResult = ({ homeResults, awayResults }) => {
    let home = 0;
    let away = 0;
    for (let index = 0; index < homeResults.length; index++) {
        const homeResult = homeResults[index];
        const awayResult = awayResults[index];
        if (homeResult > awayResult) {
            home++;
        }
        if (awayResult > homeResult) {
            away++;
        }
    }
    return { home, away };
};
exports.getFinalResult = getFinalResult;
const getNewFinalResult = ({ homeResults, awayResults }) => {
    const home = homeResults.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const away = awayResults.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return { home, away };
};
exports.getNewFinalResult = getNewFinalResult;
const customSort = (arr) => {
    return arr.sort((a, b) => {
        const diffA = Math.abs(a.analytic.home - a.analytic.away);
        const diffB = Math.abs(b.analytic.home - b.analytic.away);
        if ((a.analytic.home === 0 || a.analytic.away === 0) && (b.analytic.home !== 0 && b.analytic.away !== 0)) {
            return -1;
        }
        if ((b.analytic.home === 0 || b.analytic.away === 0) && (a.analytic.home !== 0 && a.analytic.away !== 0)) {
            return 1;
        }
        const maxA = Math.max(a.analytic.home, a.analytic.away);
        const maxB = Math.max(b.analytic.home, b.analytic.away);
        if ((maxA >= 4 && maxB >= 4) || (maxA < 4 && maxB < 4)) {
            return diffB - diffA;
        }
        if (maxA >= 4 && maxB < 4) {
            return -1;
        }
        if (maxA < 4 && maxB >= 4) {
            return 1;
        }
        return diffB - diffA;
    });
};
exports.customSort = customSort;
const getFinalList = ({ coefficients }) => {
    const keys = Object.keys(analytics_1.FINAL_LIST_COUNT);
    const finalList = [];
    const fails = [];
    let firstCount = 0;
    let secondCount = 0;
    let fourCount = 0;
    let thirdCount = 0;
    let fifthCount = 0;
    keys.forEach(key => {
        const count = analytics_1.FINAL_LIST_COUNT[key];
        for (let index = 0; index < count; index++) {
            if (analytics_1.COEFFICIENT_NAMES.FIRST === key) {
                const event = coefficients[analytics_1.COEFFICIENT_NAMES.FIRST][index];
                if (event) {
                    firstCount++;
                    finalList.push([event]);
                }
                else {
                    fails.push(analytics_1.COEFFICIENT_NAMES.FIRST);
                }
            }
            if (analytics_1.COEFFICIENT_NAMES.SECOND === key) {
                const event = coefficients[analytics_1.COEFFICIENT_NAMES.SECOND][index];
                if (event) {
                    secondCount++;
                    finalList.push([event]);
                }
                else {
                    fails.push(analytics_1.COEFFICIENT_NAMES.SECOND);
                }
            }
            if (analytics_1.COEFFICIENT_NAMES.THIRD === key) {
                const eventA = coefficients[analytics_1.COEFFICIENT_NAMES.THIRD][index];
                if (eventA) {
                    finalList.push([eventA]);
                }
                else {
                    fails.push(analytics_1.COEFFICIENT_NAMES.THIRD);
                }
            }
            if (analytics_1.COEFFICIENT_NAMES.FOURTH === key) {
                const eventA = coefficients[analytics_1.COEFFICIENT_NAMES.FOURTH][index];
                if (eventA) {
                    finalList.push([eventA]);
                }
                else {
                    fails.push(analytics_1.COEFFICIENT_NAMES.FOURTH);
                }
            }
        }
    });
    return finalList;
};
exports.getFinalList = getFinalList;
const getMatchResult = async ({ url, sport }) => {
    const { page, browser } = await (0, puppeteer_1.puppeteerLaunch)({ url, selector: '.detailScore__matchInfo .detailScore__wrapper' });
    const resultsSelector = parser_1.SELECTORS[parser_1.SERVISES.FLASH_SCORE][sport].ELEMENTS.RESULTS;
    const results = await (0, puppeteer_1.puppeteerGetAllElements)({ page, selector: resultsSelector });
    if (results && results.length === 3) {
        const home = await (0, puppeteer_1.puppeteerEvaluate)({ element: results[0], property: parser_1.PROPERTIES.TEXT_CONTENT });
        const away = await (0, puppeteer_1.puppeteerEvaluate)({ element: results[2], property: parser_1.PROPERTIES.TEXT_CONTENT });
        await (0, puppeteer_1.puppeteerBrowserClose)({ browser, url });
        if (home && away) {
            return { home, away };
        }
        return null;
    }
    await (0, puppeteer_1.puppeteerBrowserClose)({ browser, url });
    return null;
};
exports.getMatchResult = getMatchResult;
const getResults = async ({ analytics, results }) => {
    let count = 0;
    let sum = 0;
    let result = 0;
    for (const events of analytics) {
        let currentCoefficient = 1;
        let isWin = 1;
        for (const event of events) {
            const eventsForSport = [];
            if (results && results?.length) {
                results.forEach(element => {
                    const data = element?.data;
                    if (data && event?.sport && data[event.sport]) {
                        eventsForSport.push(...Object.values(data[event.sport]));
                    }
                });
            }
            const findedResult = eventsForSport.find(elem => elem.url === event.url);
            if (findedResult) {
                const myTeam = Number(findedResult.results[event.myTeam]);
                const rivalTeam = Number(findedResult.results[event.rivalTeam]);
                if (myTeam < rivalTeam) {
                    isWin = isWin - 1;
                }
                else {
                    currentCoefficient = currentCoefficient * event.coefficient;
                }
            }
            else {
                const { url, sport } = event;
                const matchResults = await (0, exports.getMatchResult)({ url, sport });
                if (matchResults) {
                    const myTeam = Number(matchResults[event.myTeam]);
                    const rivalTeam = Number(matchResults[event.rivalTeam]);
                    if (myTeam < rivalTeam) {
                        isWin = isWin - 1;
                    }
                    else {
                        currentCoefficient = currentCoefficient * event.coefficient;
                    }
                }
                else {
                    console.log(`Результаты для матча ${event.url} не найдены`);
                }
            }
            count++;
        }
        if (isWin > 0) {
            sum = sum + currentCoefficient;
            result++;
        }
    }
    const persents = result / count * 100;
    return {
        persents,
        result,
        sum,
        count
    };
};
exports.getResults = getResults;
const sumHomeAwayMatchesForLeague = (data) => {
    let count = 0;
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            count = count + Math.min(data[key].home, data[key].away);
        }
    }
    return count;
};
exports.sumHomeAwayMatchesForLeague = sumHomeAwayMatchesForLeague;
const getIsSimilarLeagues = ({ home, away }) => {
    const result = {};
    const countEvents = (array) => {
        const eventsCount = {};
        array.forEach((item) => {
            if (!eventsCount[item.event]) {
                eventsCount[item.event] = { home: 0, away: 0 };
            }
            eventsCount[item.event].home += 1;
            eventsCount[item.event].away += 1;
        });
        return eventsCount;
    };
    const homeEvents = countEvents(home);
    const awayEvents = countEvents(away);
    Object.keys(homeEvents).forEach((event) => {
        if (awayEvents[event]) {
            result[event] = {
                home: homeEvents[event].home,
                away: awayEvents[event].away,
            };
        }
    });
    if (Object.keys(result).length) {
        const count = (0, exports.sumHomeAwayMatchesForLeague)(result);
        return {
            result,
            count
        };
    }
    return null;
};
exports.getIsSimilarLeagues = getIsSimilarLeagues;
const getMissedPoints = ({ home, away, homeName, awayName }) => {
    const minGamesCount = Math.min(home.length, away.length);
    const homeMissedCounts = (0, exports.getCounts)({ games: home.slice(0, minGamesCount), team: homeName, isMissed: true });
    const awayMissedCounts = (0, exports.getCounts)({ games: away.slice(0, minGamesCount), team: awayName, isMissed: true });
    const awayProportion = (0, exports.getPercentageProportion)(homeMissedCounts, awayMissedCounts);
    const homeProportion = (0, exports.getPercentageProportion)(awayMissedCounts, homeMissedCounts);
    return { home: homeProportion, away: awayProportion };
};
exports.getMissedPoints = getMissedPoints;
//# sourceMappingURL=index.js.map