"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const analytic_1 = require("../../helpers/analytic");
const analytics_1 = require("../../constants/analytics");
const parser_1 = require("../../constants/parser");
let AnalyticsService = class AnalyticsService {
    async getAnalytics({ data }) {
        const sports = Object.keys(data);
        const analytics = {};
        sports.forEach(sport => {
            const sportData = data[sport].data;
            if (sportData) {
                const analytic = this.getAnalytic({ data: sportData, sport });
                analytics[sport] = analytic;
            }
        });
        const betList = this.getSportBetList({ analytics });
        return this.getFinalAnalytics(betList);
    }
    getAnalytic({ data, sport }) {
        const events = Object.values(data);
        const analytic = {};
        events.forEach(event => {
            if (event.home.length > 14 && event.away.length > 14) {
                const url = event.url;
                const minGamesCount = Math.min(event.home.length, event.away.length);
                const homeAllWinners = (0, analytic_1.getWinners)({ games: event.home, sport, name: event.names.home, gamesCount: minGamesCount });
                const awayAllWinners = (0, analytic_1.getWinners)({ games: event.away, sport, name: event.names.away, gamesCount: minGamesCount });
                const homeLastWinners = (0, analytic_1.getWinners)({ games: event.home, sport, name: event.names.home, gamesCount: 5 });
                const awayLastWinners = (0, analytic_1.getWinners)({ games: event.away, sport, name: event.names.away, gamesCount: 5 });
                const homeWinsAgainstAwayOpponent = (0, analytic_1.getWinners)({ games: event.games, sport, name: event.names.home, gamesCount: 3 });
                const awayWinsAgainstHomeOpponent = (0, analytic_1.getWinners)({ games: event.games, sport, name: event.names.away, gamesCount: 3 });
                const points = (0, analytic_1.getAllPoints)({ home: event.home, away: event.away, homeName: event.names.home, awayName: event.names.away });
                const missedPoints = (0, analytic_1.getMissedPoints)({ home: event.home, away: event.away, homeName: event.names.home, awayName: event.names.away });
                const rivals = (0, analytic_1.getCommonRivals)({ home: event.home, away: event.away, homeName: event.names.home, awayName: event.names.away });
                const homeRivalsRating = (0, analytic_1.getRivalsRaiting)({ games: event.home, rivals });
                const awayRivalsRating = (0, analytic_1.getRivalsRaiting)({ games: event.away, rivals });
                const allWinnersRaiting = (0, analytic_1.getWinnersRaiting)({ homeGames: homeAllWinners, awayGames: awayAllWinners });
                const lastWinnersRaiting = (0, analytic_1.getWinnersRaiting)({ homeGames: homeLastWinners, awayGames: awayLastWinners });
                const winsAgainstAwayOpponentRaiting = (0, analytic_1.getWinnersRaiting)({ homeGames: homeWinsAgainstAwayOpponent, awayGames: awayWinsAgainstHomeOpponent });
                const similarLeagues = (0, analytic_1.getIsSimilarLeagues)({ home: event.home, away: event.away });
                const homeResults = [homeRivalsRating, allWinnersRaiting.home, lastWinnersRaiting.home];
                const awayResults = [awayRivalsRating, allWinnersRaiting.away, lastWinnersRaiting.away];
                const results = (0, analytic_1.getNewFinalResult)({ homeResults, awayResults });
                const max = Math.max(results.home, results.away);
                const coefficients = sport === parser_1.SPORTS.FOOTBALL && event.otherCoefficients?.DOUBLE_CHANGE
                    ? { home: event.otherCoefficients.DOUBLE_CHANGE[0], away: event.otherCoefficients.DOUBLE_CHANGE[2] }
                    : event.coefficients;
                const maxCoefficients = Math.max(coefficients.away, coefficients.home);
                if (max > 3 && maxCoefficients < 4) {
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
                    };
                }
                if (sport === 'FOOTBALL') {
                }
            }
        });
        return analytic;
    }
    getSportBetList({ analytics }) {
        const sports = Object.keys(analytics);
        const betList = [];
        const result = {};
        sports.forEach(sport => {
            if (analytics_1.SPORTS_FOR_ANALYTIC.includes(sport)) {
                const sportAnalytic = analytics[sport];
                const events = Object.values(sportAnalytic);
                const finalEvents = events.filter(event => {
                    const home = event.analytic.home;
                    const away = event.analytic.away;
                    const total = home + away;
                    let maxPercentage = (Math.max(home, away) / total) * 100;
                    if (sport === parser_1.SPORTS.TENNIS) {
                        return maxPercentage > 75;
                    }
                    return maxPercentage > 73;
                });
                betList.push(...finalEvents);
            }
        });
        const sortedBetList = (0, analytic_1.customSort)(betList);
        return sortedBetList;
    }
    getFinalAnalytics(events) {
        const coefficients = {
            [analytics_1.COEFFICIENT_NAMES.FIRST]: [],
            [analytics_1.COEFFICIENT_NAMES.SECOND]: [],
            [analytics_1.COEFFICIENT_NAMES.THIRD]: [],
            [analytics_1.COEFFICIENT_NAMES.FOURTH]: [],
            [analytics_1.COEFFICIENT_NAMES.FIFTH]: [],
        };
        events.forEach(event => {
            const team = event.analytic.home > event.analytic.away
                ? 'home'
                : 'away';
            const rival = event.analytic.home <= event.analytic.away
                ? 'home'
                : 'away';
            const coefficient = Number(event.coefficient[team]);
            const analyzedMatch = {
                coefficient,
                count: event.isSimilarLeaguesCounts,
                team: event.names[team],
                myTeam: team,
                rivalTeam: rival,
                url: event.url,
                sport: event.sport,
                analytic: event.analytic
            };
            if (coefficient > analytics_1.COEFFICIENT_LEVELS.FIRST) {
                coefficients[analytics_1.COEFFICIENT_NAMES.FIRST].push(analyzedMatch);
            }
            if (coefficient > analytics_1.COEFFICIENT_LEVELS.SECOND && coefficient < analytics_1.COEFFICIENT_LEVELS.FIRST) {
                coefficients[analytics_1.COEFFICIENT_NAMES.SECOND].push(analyzedMatch);
            }
            if (coefficient > analytics_1.COEFFICIENT_LEVELS.THIRD && coefficient < analytics_1.COEFFICIENT_LEVELS.SECOND) {
                coefficients[analytics_1.COEFFICIENT_NAMES.THIRD].push(analyzedMatch);
            }
            if (coefficient > analytics_1.COEFFICIENT_LEVELS.FOURTH && coefficient < analytics_1.COEFFICIENT_LEVELS.THIRD) {
                coefficients[analytics_1.COEFFICIENT_NAMES.FOURTH].push(analyzedMatch);
            }
            if (coefficient > analytics_1.COEFFICIENT_LEVELS.FIFTH && coefficient < analytics_1.COEFFICIENT_LEVELS.FOURTH) {
                coefficients[analytics_1.COEFFICIENT_NAMES.FIFTH].push(analyzedMatch);
            }
        });
        return (0, analytic_1.getFinalList)({ coefficients });
    }
};
AnalyticsService = __decorate([
    (0, common_1.Injectable)()
], AnalyticsService);
exports.AnalyticsService = AnalyticsService;
//# sourceMappingURL=analytics.service.js.map