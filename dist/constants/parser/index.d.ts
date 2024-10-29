export declare const SERVISES: {
    FLASH_SCORE: string;
};
export declare const DELAY: {
    CLICK_TO_TOMOROW: number;
    CLICK_TO_H2H: number;
    CLICK_TO_SHOW_MORE: number;
};
export declare const H2H_TYPES: {
    HOME: string;
    AWAY: string;
    GAMES: string;
};
export declare const H2H_SECTION_INDEX: {
    HOME: number;
    AWAY: number;
    GAME: number;
};
export declare const SPORTS: {
    BASKETBALL: string;
    TENNIS: string;
    FOOTBALL: string;
};
export declare const URLS: {
    [x: string]: {
        [x: string]: string;
        MATCH_URL: string;
    };
};
export declare const TABS: {
    H2H: string;
    TOTAL: string;
    BTTS: string;
    DOUBLE_CHANGE: string;
};
export declare const TABS_URLS: {
    [x: string]: {
        [x: string]: string;
    };
};
export declare const MAX_RETRY_ATTEMPTS = 3;
export declare const MAX_CLICK_TO_SHOW_MORE = 4;
export declare const ACTIVE_SPORTS: string[];
export declare const OTHER_TABS: {
    [x: string]: string[];
};
export declare const DEFAULT_ELEMENTS: {
    [x: string]: {
        CALENDAR: string;
        ITEM: string;
        EVENT_TIME: string;
        EVENT_STAGE: string;
        NAME: string;
        DOUBLES_NAME: string;
        DOUBLES: string;
        TIME: string;
        TABS: string;
        LEAGUE: string;
        RESULTS: string;
        H2H: {
            DATE: string;
            ROW: string;
            EVENT: string;
            RESULT: string;
            HOME_PARTICIPANT: string;
            AWAY_PARTICIPANT: string;
        };
        ODDS: {
            WRAPPER: string;
            VALUE_INNER: string;
        };
    };
};
export declare const DEFAULT_BUTTONS: {
    [x: string]: {
        TOMORROW: string;
        LEAGUE_SHOW_MORE: string;
        H2H: {
            TAB: string;
            SHOW_MORE: string;
            SHOW_MORE_BTN: string;
        };
    };
};
export declare const DEFAULT_CONTAINERS: {
    [x: string]: {
        MAIN: string;
        LEAGUE_SHOW_MORE: string;
        H2H: {
            SECTIONS: string;
            SECTION_ROWS: string;
        };
    };
};
export declare const DEFAULT_WAITING_TO_LOAD: {
    [x: string]: {
        FIRST_BOOT: string;
        CLICK_TO_TOMORROW: string;
        H2H: string;
        MATCH_PAGE: string;
    };
};
export declare const SELECTORS: {
    [x: string]: {
        [x: string]: {
            WAITING_TO_LOAD: {
                FIRST_BOOT: string;
                CLICK_TO_TOMORROW: string;
                H2H: string;
                MATCH_PAGE: string;
            };
            BUTTONS: {
                TOMORROW: string;
                LEAGUE_SHOW_MORE: string;
                H2H: {
                    TAB: string;
                    SHOW_MORE: string;
                    SHOW_MORE_BTN: string;
                };
            };
            CONTAINERS: {
                ITEMS: string;
                MAIN: string;
                LEAGUE_SHOW_MORE: string;
                H2H: {
                    SECTIONS: string;
                    SECTION_ROWS: string;
                };
            };
            ELEMENTS: {
                CALENDAR: string;
                ITEM: string;
                EVENT_TIME: string;
                EVENT_STAGE: string;
                NAME: string;
                DOUBLES_NAME: string;
                DOUBLES: string;
                TIME: string;
                TABS: string;
                LEAGUE: string;
                RESULTS: string;
                H2H: {
                    DATE: string;
                    ROW: string;
                    EVENT: string;
                    RESULT: string;
                    HOME_PARTICIPANT: string;
                    AWAY_PARTICIPANT: string;
                };
                ODDS: {
                    WRAPPER: string;
                    VALUE_INNER: string;
                };
            };
        } | {
            WAITING_TO_LOAD: {
                FIRST_BOOT: string;
                CLICK_TO_TOMORROW: string;
                H2H: string;
                MATCH_PAGE: string;
            };
            BUTTONS: {
                TOMORROW: string;
                LEAGUE_SHOW_MORE: string;
                H2H: {
                    TAB: string;
                    SHOW_MORE: string;
                    SHOW_MORE_BTN: string;
                };
            };
            CONTAINERS: {
                TOTAL_ODDS: string;
                ITEMS: string;
                MAIN: string;
                LEAGUE_SHOW_MORE: string;
                H2H: {
                    SECTIONS: string;
                    SECTION_ROWS: string;
                };
            };
            ELEMENTS: {
                BTTS: {
                    ROW: string;
                    VALUE: string;
                };
                DOUBLE_CHANGE: {
                    ROW: string;
                    VALUE: string;
                };
                TOTAL: {
                    ROW: string;
                    TOTAL: string;
                    VALUE: string;
                };
                CALENDAR: string;
                ITEM: string;
                EVENT_TIME: string;
                EVENT_STAGE: string;
                NAME: string;
                DOUBLES_NAME: string;
                DOUBLES: string;
                TIME: string;
                TABS: string;
                LEAGUE: string;
                RESULTS: string;
                H2H: {
                    DATE: string;
                    ROW: string;
                    EVENT: string;
                    RESULT: string;
                    HOME_PARTICIPANT: string;
                    AWAY_PARTICIPANT: string;
                };
                ODDS: {
                    WRAPPER: string;
                    VALUE_INNER: string;
                };
            };
        };
    };
};
export declare const PROPERTIES: {
    TEXT_CONTENT: string;
    ID: string;
};
