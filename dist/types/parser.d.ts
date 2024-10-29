interface TeamResult {
    name: string;
    result: number;
    isWiner: boolean;
}
export interface Game {
    name: string;
    date: string;
    event: string;
    home: TeamResult;
    away: TeamResult;
}
interface Coefficients {
    home: string;
    away: string;
}
interface Names {
    home: string;
    away: string;
}
export interface SportEvent {
    name: string;
    url: string;
    coefficients: Coefficients;
    otherCoefficients: null | any;
    names: Names;
    time: string;
    home: Game[];
    away: Game[];
    games: Game[];
}
export interface SportData {
    [key: string]: SportEvent;
}
export {};
