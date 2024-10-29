import { SPORTS } from "../parser"

export const COEFFICIENT_NAMES = {
    FIRST: 'FIRST',
    SECOND: 'SECOND',
    THIRD: 'THIRD',
    FOURTH: 'FOURTH',
    FIFTH: 'FIFTH',
}

export const COEFFICIENT_LEVELS = {
    [COEFFICIENT_NAMES.FIRST]: 2,
    [COEFFICIENT_NAMES.SECOND]: 1.8,
    [COEFFICIENT_NAMES.THIRD]: 1.6,
    [COEFFICIENT_NAMES.FOURTH]: 1.4,
    [COEFFICIENT_NAMES.FIFTH]: 1.25,
}

export const FINAL_LIST_COUNT = {
    FIRST: 10,   // + (3) 1.87 1.85 2.00 2.25 1.85 2.50 1.95 2.13 2.03 1.80 1.80 2.35 1.95 2.07 2.00 2.10
    SECOND: 10,  // + (3)
    THIRD: 0,   // - (3)
    FOURTH: 0,  // - (3)
    FIFTH: 0,
}

export const SPORTS_FOR_ANALYTIC = [SPORTS.FOOTBALL]

export const DATES_FOR_ANALYTIC = ['24.08.24']
// export const DATES_FOR_ANALYTIC = [
//     // '09.07.24', '10.07.24', '11.07.24', '12.07.24', '13.07.24', '14.07.24', '15.07.24', '16.07.24','17.07.24', '18.07.24', '19.07.24', '20.07.24', '21.07.24', '22.07.24', '23.07.24', '24.07.24', '25.07.24', '26.07.24', '27.07.24', '28.07.24', '29.07.24', '30.07.24', '31.07.24',
//     '01.08.24', '02.08.24', '03.08.24', '04.08.24', '05.08.24', '06.08.24', '07.08.24', '08.08.24', '09.08.24', '10.08.24', '11.08.24', '12.08.24', '13.08.24', '14.08.24', '15.08.24', '16.08.24', '17.08.24', '18.08.24'
// ]

// 58.33