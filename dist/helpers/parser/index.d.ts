export declare const getMatchUrl: ({ id, service, tab }: {
    id: any;
    service: any;
    tab: any;
}) => string;
export declare const getCoefficients: ({ page, selectors, sport }: {
    page: any;
    selectors: any;
    sport: any;
}) => Promise<{
    home: any;
    away: any;
}>;
export declare const getNames: ({ page, selectors, sport }: {
    page: any;
    selectors: any;
    sport: any;
}) => Promise<{
    home: any;
    away: any;
}>;
export declare const getMatchTime: ({ page, selectors }: {
    page: any;
    selectors: any;
}) => Promise<any>;
export declare const getH2HTab: ({ page, selectors }: {
    page: any;
    selectors: any;
}) => Promise<any>;
export declare const getHistoryMatchDate: ({ section, selectors }: {
    section: any;
    selectors: any;
}) => Promise<any>;
export declare const getHistoryMatchEvent: ({ section, selectors }: {
    section: any;
    selectors: any;
}) => Promise<any>;
export declare const getHistoryMatchResylt: ({ section, selectors, url, type }: {
    section: any;
    selectors: any;
    url: any;
    type: any;
}) => Promise<{
    home: {
        name: any;
        result: number;
        isWiner: boolean;
    };
    away: {
        name: any;
        result: number;
        isWiner: boolean;
    };
}>;
export declare const getBttsCoefficients: ({ page, selectors }: {
    page: any;
    selectors: any;
}) => Promise<any[]>;
export declare const getTotalCoefficients: ({ page, selectors }: {
    page: any;
    selectors: any;
}) => Promise<{}>;
export declare const getDoubleChangeCoefficients: ({ page, selectors }: {
    page: any;
    selectors: any;
}) => Promise<any[]>;
