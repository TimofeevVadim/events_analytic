import { Game } from "src/types/parser";
export declare const cleanTeamName: (name: any) => any;
export declare const getWinners: ({ games, sport, name, gamesCount }: {
    games: Game[];
    sport: string;
    name: string;
    gamesCount: number;
}) => Game[];
export declare const getRivals: ({ games, team }: {
    games: any;
    team: any;
}) => any[];
export declare const getCounts: ({ games, team, isMissed }: {
    games: any;
    team: any;
    isMissed?: boolean;
}) => number;
export declare const getCommonRivals: ({ home, away, homeName, awayName }: {
    home: any;
    away: any;
    homeName: any;
    awayName: any;
}) => any[];
export declare const getPercentageProportion: (a: any, b: any) => number;
export declare const calculateAverage: (numbers: any) => number;
export declare const getRivalsRaiting: ({ games, rivals }: {
    games: any;
    rivals: any;
}) => number;
export declare const getWinnersRaiting: ({ homeGames, awayGames }: {
    homeGames: any;
    awayGames: any;
}) => {
    home: number;
    away: number;
};
export declare const getAllPoints: ({ home, away, homeName, awayName }: {
    home: any;
    away: any;
    homeName: any;
    awayName: any;
}) => {
    home: number;
    away: number;
};
export declare const getFinalResult: ({ homeResults, awayResults }: {
    homeResults: any;
    awayResults: any;
}) => {
    home: number;
    away: number;
};
export declare const getNewFinalResult: ({ homeResults, awayResults }: {
    homeResults: any;
    awayResults: any;
}) => {
    home: any;
    away: any;
};
export declare const customSort: (arr: any) => any;
export declare const getFinalList: ({ coefficients }: {
    coefficients: any;
}) => any[];
export declare const getMatchResult: ({ url, sport }: {
    url: any;
    sport: any;
}) => Promise<{
    home: any;
    away: any;
}>;
export declare const getResults: ({ analytics, results }: {
    analytics: any;
    results: any;
}) => Promise<{
    persents: number;
    result: number;
    sum: number;
    count: number;
}>;
export declare const sumHomeAwayMatchesForLeague: (data: any) => number;
export declare const getIsSimilarLeagues: ({ home, away }: {
    home: any;
    away: any;
}) => {
    result: {};
    count: number;
};
export declare const getMissedPoints: ({ home, away, homeName, awayName }: {
    home: any;
    away: any;
    homeName: any;
    awayName: any;
}) => {
    home: number;
    away: number;
};
