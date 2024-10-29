import { Injectable } from '@nestjs/common';
import { 
    getWinners,
    getCommonRivals,
    getRivalsRaiting,
    getWinnersRaiting,
    getAllPoints,
    getNewFinalResult,
    customSort,
    getFinalList,
    getResults,
    getIsSimilarLeagues,
    getMissedPoints
 } from 'src/helpers/analytic';
import { COEFFICIENT_NAMES, COEFFICIENT_LEVELS, SPORTS_FOR_ANALYTIC } from 'src/constants/analytics';
import { SportData } from 'src/types/parser';
import { SPORTS } from 'src/constants/parser';

@Injectable()
export class AnalyticsService {
    async getAnalytics({ data }) {
        const sports = Object.keys(data)
        const analytics = {}

        sports.forEach(sport => {
            const sportData = data[sport].data

            if(sportData) {
                const analytic = this.getAnalytic({ data: sportData, sport })

                analytics[sport] = analytic
            }
        })

        const betList = this.getSportBetList({ analytics })
        return this.getFinalAnalytics(betList)
    }
    getAnalytic({ data, sport }: { data: SportData, sport: string }) {
        const events = Object.values(data)
        const analytic = {}

        events.forEach(event => {
            if(event.home.length > 14 && event.away.length > 14) {
                const url = event.url
                const minGamesCount = Math.min(event.home.length, event.away.length)

                const homeAllWinners = getWinners({ games: event.home, sport, name: event.names.home, gamesCount: minGamesCount })
                const awayAllWinners = getWinners({ games: event.away, sport, name: event.names.away, gamesCount: minGamesCount })

                const homeLastWinners = getWinners({ games: event.home, sport, name: event.names.home, gamesCount: 5 })
                const awayLastWinners = getWinners({ games: event.away, sport, name: event.names.away, gamesCount: 5 })

                const homeWinsAgainstAwayOpponent = getWinners({ games: event.games, sport, name: event.names.home, gamesCount: 3 })
                const awayWinsAgainstHomeOpponent = getWinners({ games: event.games, sport, name: event.names.away, gamesCount: 3 })

                const points = getAllPoints({ home: event.home, away: event.away, homeName: event.names.home, awayName: event.names.away })
                const missedPoints = getMissedPoints({ home: event.home, away: event.away, homeName: event.names.home, awayName: event.names.away })
                const rivals = getCommonRivals({ home: event.home, away: event.away, homeName: event.names.home, awayName: event.names.away })

                const homeRivalsRating = getRivalsRaiting({ games: event.home, rivals })
                const awayRivalsRating = getRivalsRaiting({ games: event.away, rivals })

                const allWinnersRaiting = getWinnersRaiting({ homeGames: homeAllWinners, awayGames: awayAllWinners })
                const lastWinnersRaiting = getWinnersRaiting({ homeGames: homeLastWinners, awayGames: awayLastWinners })
                const winsAgainstAwayOpponentRaiting = getWinnersRaiting({ homeGames: homeWinsAgainstAwayOpponent, awayGames: awayWinsAgainstHomeOpponent })

                const similarLeagues = getIsSimilarLeagues({ home: event.home, away: event.away })
                // console.log(isSimilarLeagues, 'isSimilarLeagues')
                // const homeResults = [homeRivalsRating, allWinnersRaiting.home, winsAgainstAwayOpponentRaiting.home, lastWinnersRaiting.home]
                // const awayResults = [awayRivalsRating, allWinnersRaiting.away, winsAgainstAwayOpponentRaiting.away, lastWinnersRaiting.away]

                const homeResults = [homeRivalsRating, allWinnersRaiting.home, lastWinnersRaiting.home]
                const awayResults = [awayRivalsRating, allWinnersRaiting.away, lastWinnersRaiting.away]

                const results = getNewFinalResult({ homeResults, awayResults })

                const max = Math.max(results.home, results.away)
                
                const coefficients = sport === SPORTS.FOOTBALL && event.otherCoefficients?.DOUBLE_CHANGE
                    ? { home: event.otherCoefficients.DOUBLE_CHANGE[0], away: event.otherCoefficients.DOUBLE_CHANGE[2] }
                    : event.coefficients

                const maxCoefficients = Math.max(coefficients.away, coefficients.home)
                // const isMissed = sport === SPORTS.FOOTBALL
                //     ? similarLeagues?.count > 6
                //     : similarLeagues?.count > 0

                if(max > 3 && maxCoefficients < 4) {
                // if(max > 3 &&  maxCoefficients < 9 && maxCoefficients > 3) {
                    analytic[url] = {
                        analytic: {
                            home: results.home,
                            away: results.away,
                        },
                        url,
                        sport,
                        names: event.names,
                        coefficient: coefficients,
                        otherCoefficients: event.otherCoefficients
                    }
                }

                if(sport === 'FOOTBALL') {
                }
            }
        })

        return analytic
    }
    getSportBetList({ analytics }) {
        const sports = Object.keys(analytics)
        const betList = []
        const result = {}

        sports.forEach(sport => {
            if(SPORTS_FOR_ANALYTIC.includes(sport)) {
                const sportAnalytic = analytics[sport]
                const events = Object.values(sportAnalytic)

                const finalEvents = events.filter(event => {
                    // @ts-ignore
                    const home = event.analytic.home;
                    // @ts-ignore
                    const away = event.analytic.away;

                    const total = home + away;
                    let maxPercentage = (Math.max(home, away) / total) * 100;

                    if(sport === SPORTS.TENNIS) {
                        return maxPercentage > 75
                    }

                    return maxPercentage > 73
                    // return maxPercentage < 80 && maxPercentage > 72
                })
                // console.log({
                //     finalEvents: finalEvents.length,
                //     events: events.length,
                // }, 'TEST')
                betList.push(...finalEvents)
            }
        })

        const sortedBetList = customSort(betList)



        return sortedBetList
    }
    getFinalAnalytics(events) {
        const coefficients = {
            [COEFFICIENT_NAMES.FIRST]: [],
            [COEFFICIENT_NAMES.SECOND]: [],
            [COEFFICIENT_NAMES.THIRD]: [],
            [COEFFICIENT_NAMES.FOURTH]: [],
            [COEFFICIENT_NAMES.FIFTH]: [],
        }

        events.forEach(event => {
            const team = event.analytic.home > event.analytic.away
                ? 'home'
                : 'away'

            const rival = event.analytic.home <= event.analytic.away
                ? 'home'
                : 'away'

            const coefficient = Number(event.coefficient[team])

            const analyzedMatch = {
                coefficient,
                count: event.isSimilarLeaguesCounts,
                team: event.names[team],
                myTeam: team,
                rivalTeam: rival,
                url: event.url,
                sport: event.sport,
                analytic: event.analytic
            }

            if(coefficient > COEFFICIENT_LEVELS.FIRST) {
                coefficients[COEFFICIENT_NAMES.FIRST].push(analyzedMatch)
            }

            if(coefficient > COEFFICIENT_LEVELS.SECOND && coefficient < COEFFICIENT_LEVELS.FIRST) {
                coefficients[COEFFICIENT_NAMES.SECOND].push(analyzedMatch)
            }

            if(coefficient > COEFFICIENT_LEVELS.THIRD && coefficient < COEFFICIENT_LEVELS.SECOND) {
                coefficients[COEFFICIENT_NAMES.THIRD].push(analyzedMatch)
            }

            if(coefficient > COEFFICIENT_LEVELS.FOURTH && coefficient < COEFFICIENT_LEVELS.THIRD) {
                coefficients[COEFFICIENT_NAMES.FOURTH].push(analyzedMatch)
            }

            if(coefficient > COEFFICIENT_LEVELS.FIFTH && coefficient < COEFFICIENT_LEVELS.FOURTH) {
                coefficients[COEFFICIENT_NAMES.FIFTH].push(analyzedMatch)
            }

        })

        return getFinalList({ coefficients })
    }
}
