"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROPERTIES = exports.SELECTORS = exports.DEFAULT_WAITING_TO_LOAD = exports.DEFAULT_CONTAINERS = exports.DEFAULT_BUTTONS = exports.DEFAULT_ELEMENTS = exports.OTHER_TABS = exports.ACTIVE_SPORTS = exports.MAX_CLICK_TO_SHOW_MORE = exports.MAX_RETRY_ATTEMPTS = exports.TABS_URLS = exports.TABS = exports.URLS = exports.SPORTS = exports.H2H_SECTION_INDEX = exports.H2H_TYPES = exports.DELAY = exports.SERVISES = void 0;
exports.SERVISES = {
    FLASH_SCORE: 'FLASH_SCORE'
};
exports.DELAY = {
    CLICK_TO_TOMOROW: 10000,
    CLICK_TO_H2H: 1000,
    CLICK_TO_SHOW_MORE: 300
};
exports.H2H_TYPES = {
    HOME: 'HOME',
    AWAY: 'AWAY',
    GAMES: 'GAMES'
};
exports.H2H_SECTION_INDEX = {
    HOME: 0,
    AWAY: 1,
    GAME: 2
};
exports.SPORTS = {
    BASKETBALL: 'BASKETBALL',
    TENNIS: 'TENNIS',
    FOOTBALL: 'FOOTBALL'
};
exports.URLS = {
    [exports.SERVISES.FLASH_SCORE]: {
        [exports.SPORTS.BASKETBALL]: 'https://www.flashscorekz.com/basketball/',
        [exports.SPORTS.TENNIS]: 'https://www.flashscorekz.com/tennis/',
        [exports.SPORTS.FOOTBALL]: 'https://www.flashscorekz.com',
        MATCH_URL: 'https://www.flashscorekz.com/match/'
    }
};
exports.TABS = {
    H2H: 'H2H',
    TOTAL: 'TOTAL',
    BTTS: 'BTTS',
    DOUBLE_CHANGE: 'DOUBLE_CHANGE'
};
exports.TABS_URLS = {
    [exports.SERVISES.FLASH_SCORE]: {
        [exports.TABS.H2H]: '#/h2h/overall',
        [exports.TABS.TOTAL]: '#/odds-comparison/over-under/full-time',
        [exports.TABS.BTTS]: '#/odds-comparison/both-teams-to-score/full-time',
        [exports.TABS.DOUBLE_CHANGE]: '#/odds-comparison/double-chance/full-time'
    }
};
exports.MAX_RETRY_ATTEMPTS = 3;
exports.MAX_CLICK_TO_SHOW_MORE = 4;
exports.ACTIVE_SPORTS = [exports.SPORTS.FOOTBALL];
exports.OTHER_TABS = {
    [exports.SPORTS.FOOTBALL]: [exports.TABS.TOTAL, exports.TABS.BTTS, exports.TABS.DOUBLE_CHANGE]
};
exports.DEFAULT_ELEMENTS = {
    [exports.SERVISES.FLASH_SCORE]: {
        CALENDAR: '.calendarCont',
        ITEM: '.event__match--twoLine',
        EVENT_TIME: '.event__time',
        EVENT_STAGE: '.event__stage',
        NAME: '.participant__overflow .participant__participantName',
        DOUBLES_NAME: '.participant__participantNameWrapper .participant__participantName',
        DOUBLES: '.participant__doubles',
        TIME: '.duelParticipant__startTime',
        TABS: '._tabs_e0xut_4 a',
        LEAGUE: '.h2h__event span',
        RESULTS: '.detailScore__matchInfo .detailScore__wrapper span',
        H2H: {
            DATE: '.h2h__date',
            ROW: '.h2h__row',
            EVENT: '.h2h__event',
            RESULT: '.h2h__result span',
            HOME_PARTICIPANT: '.h2h__homeParticipant',
            AWAY_PARTICIPANT: '.h2h__awayParticipant',
        },
        ODDS: {
            WRAPPER: '.oddsWrapper',
            VALUE_INNER: '.oddsValueInner',
        }
    }
};
exports.DEFAULT_BUTTONS = {
    [exports.SERVISES.FLASH_SCORE]: {
        TOMORROW: '.calendar__navigation--tomorrow',
        LEAGUE_SHOW_MORE: '._accordion_agv26_4 ._simpleText_17t4c_4',
        H2H: {
            TAB: '._tab_e0xut_4',
            SHOW_MORE: '.h2h__section .showMore',
            SHOW_MORE_BTN: '.showMore'
        }
    }
};
exports.DEFAULT_CONTAINERS = {
    [exports.SERVISES.FLASH_SCORE]: {
        MAIN: '.leagues--live',
        LEAGUE_SHOW_MORE: '._trigger_1dbpj_26',
        H2H: {
            SECTIONS: '.h2h__section',
            SECTION_ROWS: '.h2h__section .rows'
        }
    }
};
exports.DEFAULT_WAITING_TO_LOAD = {
    [exports.SERVISES.FLASH_SCORE]: {
        FIRST_BOOT: '.leagues--live',
        CLICK_TO_TOMORROW: '.leagues--live .sportName',
        H2H: '.h2h',
        MATCH_PAGE: '.container__detailInner'
    }
};
exports.SELECTORS = {
    [exports.SERVISES.FLASH_SCORE]: {
        [exports.SPORTS.BASKETBALL]: {
            WAITING_TO_LOAD: {
                ...exports.DEFAULT_WAITING_TO_LOAD[exports.SERVISES.FLASH_SCORE],
            },
            BUTTONS: {
                ...exports.DEFAULT_BUTTONS[exports.SERVISES.FLASH_SCORE],
            },
            CONTAINERS: {
                ...exports.DEFAULT_CONTAINERS[exports.SERVISES.FLASH_SCORE],
                ITEMS: '.basketball',
            },
            ELEMENTS: {
                ...exports.DEFAULT_ELEMENTS[exports.SERVISES.FLASH_SCORE]
            }
        },
        [exports.SPORTS.TENNIS]: {
            WAITING_TO_LOAD: {
                ...exports.DEFAULT_WAITING_TO_LOAD[exports.SERVISES.FLASH_SCORE],
            },
            BUTTONS: {
                ...exports.DEFAULT_BUTTONS[exports.SERVISES.FLASH_SCORE],
            },
            CONTAINERS: {
                ...exports.DEFAULT_CONTAINERS[exports.SERVISES.FLASH_SCORE],
                ITEMS: '.tennis',
            },
            ELEMENTS: {
                ...exports.DEFAULT_ELEMENTS[exports.SERVISES.FLASH_SCORE]
            }
        },
        [exports.SPORTS.FOOTBALL]: {
            WAITING_TO_LOAD: {
                ...exports.DEFAULT_WAITING_TO_LOAD[exports.SERVISES.FLASH_SCORE],
            },
            BUTTONS: {
                ...exports.DEFAULT_BUTTONS[exports.SERVISES.FLASH_SCORE],
            },
            CONTAINERS: {
                ...exports.DEFAULT_CONTAINERS[exports.SERVISES.FLASH_SCORE],
                TOTAL_ODDS: '.oddsCell__odds .ui-table__body',
                ITEMS: '.soccer',
            },
            ELEMENTS: {
                ...exports.DEFAULT_ELEMENTS[exports.SERVISES.FLASH_SCORE],
                BTTS: {
                    ROW: '.oddsCell__odds .ui-table__row',
                    VALUE: '.oddsCell__odd span',
                },
                DOUBLE_CHANGE: {
                    ROW: '.oddsCell__odds .ui-table__row',
                    VALUE: '.oddsCell__odd span',
                },
                TOTAL: {
                    ROW: '.ui-table__row',
                    TOTAL: '.oddsCell__noOddsCell',
                    VALUE: '.oddsCell__odd span'
                }
            }
        },
    }
};
exports.PROPERTIES = {
    TEXT_CONTENT: 'textContent',
    ID: 'id'
};
//# sourceMappingURL=index.js.map