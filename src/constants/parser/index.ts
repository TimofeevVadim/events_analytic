export const SERVISES = {
    FLASH_SCORE: 'FLASH_SCORE'
}

export const DELAY = {
    CLICK_TO_TOMOROW: 10000,
    CLICK_TO_H2H: 1000,
    CLICK_TO_SHOW_MORE: 300
}

export const H2H_TYPES = {
    HOME: 'HOME',
    AWAY: 'AWAY',
    GAMES: 'GAMES'
}

export const H2H_SECTION_INDEX = {
    HOME: 0,
    AWAY: 1,
    GAME: 2
}

export const SPORTS = {
    BASKETBALL: 'BASKETBALL',
    TENNIS: 'TENNIS',
    FOOTBALL: 'FOOTBALL'
}

export const URLS = {
    [SERVISES.FLASH_SCORE]: {
        [SPORTS.BASKETBALL]: 'https://www.flashscorekz.com/basketball/',
        [SPORTS.TENNIS]: 'https://www.flashscorekz.com/tennis/',
        [SPORTS.FOOTBALL]: 'https://www.flashscorekz.com',
        MATCH_URL: 'https://www.flashscorekz.com/match/'
    } 
}

export const TABS = {
    H2H: 'H2H',
    TOTAL: 'TOTAL',
    BTTS: 'BTTS',
    DOUBLE_CHANGE: 'DOUBLE_CHANGE'
}

export const TABS_URLS = {
    [SERVISES.FLASH_SCORE]: {
        [TABS.H2H]: '#/h2h/overall',
        [TABS.TOTAL]: '#/odds-comparison/over-under/full-time',
        [TABS.BTTS]: '#/odds-comparison/both-teams-to-score/full-time',
        [TABS.DOUBLE_CHANGE]: '#/odds-comparison/double-chance/full-time'
    } 
}

export const MAX_RETRY_ATTEMPTS = 3
export const MAX_CLICK_TO_SHOW_MORE = 4
export const ACTIVE_SPORTS = [SPORTS.FOOTBALL]

export const OTHER_TABS = {
    [SPORTS.FOOTBALL]: [TABS.TOTAL, TABS.BTTS, TABS.DOUBLE_CHANGE]
}

export const DEFAULT_ELEMENTS = {
    [SERVISES.FLASH_SCORE]: {
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
}

export const DEFAULT_BUTTONS = {
    [SERVISES.FLASH_SCORE]: {
        TOMORROW: '.calendar__navigation--tomorrow',
        LEAGUE_SHOW_MORE: '._accordion_agv26_4 ._simpleText_17t4c_4',
        H2H: {
            TAB: '._tab_e0xut_4',
            SHOW_MORE: '.h2h__section .showMore',
            SHOW_MORE_BTN: '.showMore'
        }
    }
}

export const DEFAULT_CONTAINERS = {
    [SERVISES.FLASH_SCORE]: {
        MAIN: '.leagues--live',
        LEAGUE_SHOW_MORE: '._trigger_1dbpj_26',
        H2H: {
            SECTIONS: '.h2h__section',
            SECTION_ROWS: '.h2h__section .rows'
        }
    }
}

export const DEFAULT_WAITING_TO_LOAD = {
    [SERVISES.FLASH_SCORE]: {
        FIRST_BOOT: '.leagues--live',
        CLICK_TO_TOMORROW: '.leagues--live .sportName',
        H2H: '.h2h',
        MATCH_PAGE: '.container__detailInner'
    }
}

export const SELECTORS = {
    [SERVISES.FLASH_SCORE]: {
        [SPORTS.BASKETBALL]: {
            WAITING_TO_LOAD: {
                ...DEFAULT_WAITING_TO_LOAD[SERVISES.FLASH_SCORE],
            },
            BUTTONS: {
                ...DEFAULT_BUTTONS[SERVISES.FLASH_SCORE],
            },
            CONTAINERS: {
                ...DEFAULT_CONTAINERS[SERVISES.FLASH_SCORE],
                ITEMS: '.basketball',
            },
            ELEMENTS: {
                ...DEFAULT_ELEMENTS[SERVISES.FLASH_SCORE]
            }
        },
        [SPORTS.TENNIS]: {
            WAITING_TO_LOAD: {
                ...DEFAULT_WAITING_TO_LOAD[SERVISES.FLASH_SCORE],
            },
            BUTTONS: {
                ...DEFAULT_BUTTONS[SERVISES.FLASH_SCORE],
            },
            CONTAINERS: {
                ...DEFAULT_CONTAINERS[SERVISES.FLASH_SCORE],
                ITEMS: '.tennis',
            },
            ELEMENTS: {
                ...DEFAULT_ELEMENTS[SERVISES.FLASH_SCORE]
            }
        },
        [SPORTS.FOOTBALL]: {
            WAITING_TO_LOAD: {
                ...DEFAULT_WAITING_TO_LOAD[SERVISES.FLASH_SCORE],
            },
            BUTTONS: {
                ...DEFAULT_BUTTONS[SERVISES.FLASH_SCORE],
            },
            CONTAINERS: {
                ...DEFAULT_CONTAINERS[SERVISES.FLASH_SCORE],
                TOTAL_ODDS: '.oddsCell__odds .ui-table__body',
                ITEMS: '.soccer',
            },
            ELEMENTS: {
                ...DEFAULT_ELEMENTS[SERVISES.FLASH_SCORE],
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
}

export const PROPERTIES = {
    TEXT_CONTENT: 'textContent',
    ID: 'id'
}