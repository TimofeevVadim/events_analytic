export declare const getParsedSportData: ({ sport, isFirstHalfOfDay }: {
    sport: any;
    isFirstHalfOfDay: any;
}) => Promise<{
    data: {};
    failedUrls: string[];
}>;
export declare const getSportItems: ({ selectors, page, isFirstHalfOfDay }: {
    selectors: any;
    page: any;
    isFirstHalfOfDay: any;
}) => Promise<any>;
export declare const getMatchUrls: ({ items, service, selectors, isFirstHalfOfDay }: {
    items: any;
    service: any;
    selectors: any;
    isFirstHalfOfDay: any;
}) => Promise<any[]>;
export declare const processingAvailableMatches: ({ items, page, selectors, sport, service }: {
    items: any;
    page: any;
    selectors: any;
    sport: any;
    service: any;
}) => Promise<{
    data: {};
    failedUrls: string[];
}>;
export declare const parseMatchData: ({ page, selectors, url, sport, id, service }: {
    page: any;
    selectors: any;
    url: any;
    sport: any;
    id: any;
    service: any;
}) => Promise<{
    name: string;
    url: any;
    coefficients: {
        home: any;
        away: any;
    };
    otherCoefficients: {};
    names: {
        home: any;
        away: any;
    };
    time: any;
    home: any[];
    away: any[];
    games: any[];
}>;
export declare const getOtherCoefficients: ({ id, page, selectors, sport, service }: {
    id: any;
    page: any;
    selectors: any;
    sport: any;
    service: any;
}) => Promise<{}>;
export declare const onSwitchToTomorrow: ({ page, selectors }: {
    page: any;
    selectors: any;
}) => Promise<any>;
export declare const onClickToH2H: ({ page, selectors }: {
    page: any;
    selectors: any;
}) => Promise<any>;
export declare const clickToShowMore: ({ page, selectors }: {
    page: any;
    selectors: any;
}) => Promise<void>;
export declare const clickToLeagueShowMore: ({ page, elements, selectors }: {
    page: any;
    elements: any;
    selectors: any;
}) => Promise<void>;
export declare const getH2hHistory: ({ page, selectors, url }: {
    page: any;
    selectors: any;
    url: any;
}) => Promise<{
    home: any[];
    away: any[];
    games: any[];
}>;
export declare const getHistoryData: ({ section, selectors, url, type }: {
    section: any;
    selectors: any;
    url: any;
    type: any;
}) => Promise<any[]>;
