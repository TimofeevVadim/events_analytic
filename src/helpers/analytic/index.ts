import { Game } from "src/types/parser"
import { FINAL_LIST_COUNT, COEFFICIENT_NAMES } from "src/constants/analytics";
import { SPORTS, SELECTORS, SERVISES, PROPERTIES } from "src/constants/parser";

import { puppeteerLaunch, puppeteerBrowserClose, puppeteerGetAllElements, puppeteerEvaluate } from "../puppeteer";

export const cleanTeamName = (name) => {
    return name.replace(/\s*\(.*?\)\s*/g, '').trim();
}

export const getWinners = ({
    games, sport, name, gamesCount
}: { games: Game[], sport: string, name: string, gamesCount: number }) => {
    return games.slice(0, gamesCount).filter(game => {
        const { away, home } = game
        const homeName = cleanTeamName(home.name)
        const awayName = cleanTeamName(away.name)
        const mainName = cleanTeamName(name)
        
        return (homeName === mainName && home.isWiner) 
            || (awayName === mainName && away.isWiner);
    })
}


export const getRivals = ({ games, team }) => {
    const rivals = []

    games.forEach(game => {
        if(game.home.name === team) {
            rivals.push(game.away.name)
        }

        if(game.away.name === team) {
            rivals.push(game.home.name)
        }
    })

    return rivals
}
export const getCounts = ({ games, team, isMissed = false }) => {
    let counts = 0

    games.forEach(game => {
        if(!isMissed && game.home.name === team) {
            counts = counts + Number(game.home.result)
        }

        if(!isMissed && game.away.name === team) {
            counts = counts + Number(game.away.result)
        }

        if(isMissed && game.home.name !== team) {
            counts = counts + Number(game.home.result)
        }

        if(isMissed && game.away.name !== team) {
            counts = counts + Number(game.away.result)
        }
    })

    return counts
}

export const getCommonRivals = ({ home, away, homeName, awayName }) => {
    const homeRivals = getRivals({ games: home, team: homeName })
    const awayRivals = getRivals({ games: away, team: awayName })

    const intersections = homeRivals.filter(rival => awayRivals.includes(rival));

    return [...new Set(intersections)]
}

export const getPercentageProportion = (a, b) => {
    if(!Number(b)) {
        return 100
    }

    if(!Number(a)) {
        return 0
    }

    const total = Number(a) + Number(b);
    const proportion = (a / total) * 100;

    return Number(proportion.toFixed(2));
}

export const calculateAverage = (numbers) => {
    const total = numbers.reduce((sum, number) => sum + number, 0);
    const average = total
        ? total / numbers.length
        : 0

    return Number(average.toFixed(2));
}

export const getRivalsRaiting = ({ games, rivals }) => {
    const raitings = []
    games.forEach(game => {
        if(rivals.includes(game.home.name)) {
            raitings.push(getPercentageProportion(game.away.result, game.home.result))
        }

        if(rivals.includes(game.away.name)) {
            raitings.push(getPercentageProportion(game.home.result, game.away.result))
        }
    })

    return calculateAverage(raitings)
}

export const getWinnersRaiting = ({ homeGames, awayGames }) => {
    const homeProportion = getPercentageProportion(homeGames.length, awayGames.length)
    const awayProportion = getPercentageProportion(awayGames.length, homeGames.length)

    return { home: homeProportion, away: awayProportion }
}

export const getAllPoints = ({ home, away, homeName, awayName }) => {
    const minGamesCount = Math.min(home.length, away.length)

    const homeCounts = getCounts({ games: home.slice(0, minGamesCount), team: homeName })
    const awayCounts = getCounts({ games: away.slice(0, minGamesCount), team: awayName })

    const homeProportion = getPercentageProportion(homeCounts, awayCounts)
    const awayProportion = getPercentageProportion(awayCounts, homeCounts)

    return { home: homeProportion, away: awayProportion }
}

export const getFinalResult = ({ homeResults, awayResults }) => {
    let home = 0
    let away = 0

    for (let index = 0; index < homeResults.length; index++) {
        const homeResult = homeResults[index];
        const awayResult = awayResults[index];

        if(homeResult > awayResult) {
            home++
        }

        if(awayResult > homeResult) {
            away++
        }
    }

    return { home, away }
}

export const getNewFinalResult = ({ homeResults, awayResults }) => {
    const home = homeResults.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const away = awayResults.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    return { home, away }
}

export const customSort = (arr) => {
    return arr.sort((a, b) => {
        const diffA = Math.abs(a.analytic.home - a.analytic.away);
        const diffB = Math.abs(b.analytic.home - b.analytic.away);

        // Критерий 1: Один из элементов равен 0, другой максимален
        if ((a.analytic.home === 0 || a.analytic.away === 0) && (b.analytic.home !== 0 && b.analytic.away !== 0)) {
            return -1;
        }
        if ((b.analytic.home === 0 || b.analytic.away === 0) && (a.analytic.home !== 0 && a.analytic.away !== 0)) {
            return 1;
        }

        // Критерий 2: Большее значение не меньше 4
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

        // Критерий 3: Просто элементы с большей разницей к меньшей
        return diffB - diffA;
    });
}

export const getFinalList = ({ coefficients }) => {
    const keys = Object.keys(FINAL_LIST_COUNT)
    const finalList = []
    const fails = []

    let firstCount = 0
    let secondCount = 0
    let fourCount = 0
    let thirdCount = 0
    let fifthCount = 0

    keys.forEach(key => {
        const count = FINAL_LIST_COUNT[key]

        for (let index = 0; index < count; index++) {
            if(COEFFICIENT_NAMES.FIRST === key) {
                const event = coefficients[COEFFICIENT_NAMES.FIRST][index]
                if(event) {
                    firstCount++
                    finalList.push([event])
                } else {
                    fails.push(COEFFICIENT_NAMES.FIRST)
                }
            }

            if(COEFFICIENT_NAMES.SECOND === key) {
                const event = coefficients[COEFFICIENT_NAMES.SECOND][index]

                if(event) {
                    secondCount++
                    finalList.push([event])
                } else {
                    fails.push(COEFFICIENT_NAMES.SECOND)
                }
            }

            if(COEFFICIENT_NAMES.THIRD === key) {
                const eventA = coefficients[COEFFICIENT_NAMES.THIRD][index]
                if(eventA) {
                    finalList.push([eventA])
                } else {
                    fails.push(COEFFICIENT_NAMES.THIRD)
                }
            }

            if(COEFFICIENT_NAMES.FOURTH === key) {
                const eventA = coefficients[COEFFICIENT_NAMES.FOURTH][index]
                // const eventB = coefficients[COEFFICIENT_NAMES.FIFTH][fifthCount]

                // if(eventB) {
                //     fifthCount++
                // }

                // const eventC = coefficients[COEFFICIENT_NAMES.FIFTH][fifthCount]

                if(eventA) {
                    // fourCount++
                    // fifthCount++

                    finalList.push([eventA])
                } else {
                    fails.push(COEFFICIENT_NAMES.FOURTH)
                }
            }
        }
    })

    return finalList
}

export const getMatchResult = async ({ url, sport }) => {
    const { page, browser } = await puppeteerLaunch({ url, selector: '.detailScore__matchInfo .detailScore__wrapper' })

    const resultsSelector = SELECTORS[SERVISES.FLASH_SCORE][sport].ELEMENTS.RESULTS

    const results = await puppeteerGetAllElements({ page, selector: resultsSelector })

    if(results && results.length === 3) {
        const home = await puppeteerEvaluate({ element: results[0], property: PROPERTIES.TEXT_CONTENT })
        const away = await puppeteerEvaluate({ element: results[2], property: PROPERTIES.TEXT_CONTENT })

        await puppeteerBrowserClose({ browser, url })

        if(home && away) {
            return { home, away }
        }

        return null
    }

    await puppeteerBrowserClose({ browser, url })

    return null
}

export const getResults = async ({ analytics, results }) => {
    let count = 0;
    let sum = 0;
    let result = 0;

    for (const events of analytics) {
        let currentCoefficient = 1;
        let isWin = 1;
        // console.log(events, 'events')
        // console.log(events)  14,4 1.9 2.3 4.4 2.1
        for (const event of events) {
            const eventsForSport = []

            if(results && results?.length) {
                results.forEach( element => {
                    const data = element?.data
    
                    if(data && event?.sport && data[event.sport]) {
                        eventsForSport.push(...Object.values(data[event.sport]))
                    }
                });
            }

            // @ts-ignore
            const findedResult = eventsForSport.find(elem => elem.url === event.url);

            if (findedResult) {
                // @ts-ignore
                const myTeam = Number(findedResult.results[event.myTeam]);
                // @ts-ignore
                const rivalTeam = Number(findedResult.results[event.rivalTeam]);

                if (myTeam < rivalTeam) {                    
                    isWin = isWin - 1;
                } else {
                    // console.log(event)
                    currentCoefficient = currentCoefficient * event.coefficient;
                }
            } else {
                const { url, sport } = event;
                const matchResults = await getMatchResult({ url, sport });

                if(matchResults) {
                    const myTeam = Number(matchResults[event.myTeam]);
                    const rivalTeam = Number(matchResults[event.rivalTeam]);

                    if (myTeam < rivalTeam) {                    
                        isWin = isWin - 1;
                    } else {
                        // console.log(event)
                        currentCoefficient = currentCoefficient * event.coefficient;
                    }
                } else {
                    console.log(`Результаты для матча ${event.url} не найдены`);
                }
            }

            count++;
        }
        // console.log(isWin, 'isWin')
        if (isWin > 0) {
            sum = sum + currentCoefficient;
            result++;
        }

        // console.log(sum, 'sum')
    }

    const persents = result / count * 100;

    return {
        persents,
        result,
        sum,
        count
    };
}

export const sumHomeAwayMatchesForLeague = (data) => {
    let count = 0
  
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        count = count + Math.min(data[key].home, data[key].away)
      }
    }
  
    return count;
  }

export const getIsSimilarLeagues = ({ home, away }) => {
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

    if(Object.keys(result).length) {
        const count = sumHomeAwayMatchesForLeague(result)

        return {
            result,
            count
        };
    }

    return null;
}

export const getMissedPoints = ({ home, away, homeName, awayName }) => {
    const minGamesCount = Math.min(home.length, away.length)

    const homeMissedCounts = getCounts({ games: home.slice(0, minGamesCount), team: homeName, isMissed: true })
    const awayMissedCounts = getCounts({ games: away.slice(0, minGamesCount), team: awayName, isMissed: true })

    const awayProportion = getPercentageProportion(homeMissedCounts, awayMissedCounts)
    const homeProportion = getPercentageProportion(awayMissedCounts, homeMissedCounts)

    return { home: homeProportion, away: awayProportion }
}