import { SERVISES, URLS, PROPERTIES, SPORTS, TABS_URLS } from "src/constants/parser";
import { 
    puppeteerGetFirstElement,
    puppeteerGetAllElements,
    puppeteerEvaluate
 } from "../puppeteer";

export const getMatchUrl = ({ id, service, tab }) => {
    if(!id) {
        return ''
    }

    switch (service) {
        case SERVISES.FLASH_SCORE:
            const extracted = id.split('_').pop();

            return `${URLS[service].MATCH_URL}${extracted}/${TABS_URLS[service][tab]}`
    
        default:
            return ''
    }
}

export const getCoefficients = async ({ page, selectors, sport }) => {
    const oddsSelector = selectors.ELEMENTS.ODDS.WRAPPER
    const coefficientSelector = selectors.ELEMENTS.ODDS.VALUE_INNER
    const isFootbal = SPORTS.FOOTBALL === sport

    const odds = await puppeteerGetFirstElement({ page, selector: oddsSelector })
    const coefficients = await puppeteerGetAllElements({ page: odds, selector: coefficientSelector })

    const isCoefficientsNotFound = isFootbal
        ? coefficients?.length < 3
        : coefficients?.length < 2

    if(!coefficients || isCoefficientsNotFound) {
        return null
    }

    const property = PROPERTIES.TEXT_CONTENT

    const awayCoefficient = isFootbal
        ? coefficients[2]
        : coefficients[1]

    const home = await puppeteerEvaluate({ element: coefficients[0], property })
    const away = await puppeteerEvaluate({ element: awayCoefficient, property })

    return home && away 
        ? { home, away }
        : null
}

export const getNames = async ({ page, selectors, sport }) => {
    const isTennis = SPORTS.TENNIS === sport
    const doublesSelector = selectors.ELEMENTS.DOUBLES
    const property = PROPERTIES.TEXT_CONTENT

    const isDoubles = isTennis 
        ?   await puppeteerGetFirstElement({ page, selector: doublesSelector })
        :   false

    const nameSelector = isDoubles
        ?   selectors.ELEMENTS.DOUBLES_NAME
        :   selectors.ELEMENTS.NAME

    const names = await puppeteerGetAllElements({ page, selector: nameSelector })

    if(isDoubles) {
        if(names.length < 4) {
            return null
        }

        const homeFirst = await puppeteerEvaluate({ element: names[0], property })
        const homeSecond = await puppeteerEvaluate({ element: names[1], property })

        const awayFirst = await puppeteerEvaluate({ element: names[2], property })
        const awaySecond = await puppeteerEvaluate({ element: names[3], property })

        const home = `${homeFirst}/${homeSecond}`
        const away = `${awayFirst}/${awaySecond}`

        return home && away 
            ? { home, away }
            : null
    }

    const home = await puppeteerEvaluate({ element: names[0], property })
    const away = await puppeteerEvaluate({ element: names[1], property })

    return home && away 
        ? { home, away }
        : null
}

export const getMatchTime = async ({ page, selectors }) => {
    const timeSelector = selectors.ELEMENTS.TIME
    const property = PROPERTIES.TEXT_CONTENT

    const timeContainer = await puppeteerGetFirstElement({ page, selector: timeSelector })
    const time = await puppeteerEvaluate({ element: timeContainer, property })

    return time ? time : null
}

export const getH2HTab = async ({ page, selectors }) => {
    try {
        const selector = selectors.ELEMENTS.TABS
        const tabs = await puppeteerGetAllElements({ page, selector })

        if(tabs.length < 3) {
            return null
        }

        return tabs[2]
    } catch (error) {
        return null
    }
}

export const getHistoryMatchDate = async ({ section, selectors }) => {
    const selector = selectors.ELEMENTS.H2H.DATE
    const property = PROPERTIES.TEXT_CONTENT 

    const element = await puppeteerGetFirstElement({ page: section, selector })
    const date = await puppeteerEvaluate({ element, property })

    return date
}

export const getHistoryMatchEvent = async ({ section, selectors }) => {
    const selector = selectors.ELEMENTS.H2H.EVENT
    const property = PROPERTIES.TEXT_CONTENT 

    const element = await puppeteerGetFirstElement({ page: section, selector })
    const event = await puppeteerEvaluate({ element, property })

    return event
}

export const getHistoryMatchResylt = async ({ section, selectors, url, type }) => {
    const resultSelector = selectors.ELEMENTS.H2H.RESULT
    const homeSelector = selectors.ELEMENTS.H2H.HOME_PARTICIPANT
    const awaySelector = selectors.ELEMENTS.H2H.AWAY_PARTICIPANT
    const property = PROPERTIES.TEXT_CONTENT

    const results = await puppeteerGetAllElements({ page: section, selector: resultSelector })

    if(!results && results.length < 2) {
        return null
    }


    const homeResult = await puppeteerEvaluate({ element: results[0], property })
    const awayResult = await puppeteerEvaluate({ element: results[1], property })

    const homeParticipant = await puppeteerGetFirstElement({ page: section, selector: homeSelector })
    const awayParticipant = await puppeteerGetFirstElement({ page: section, selector: awaySelector })

    const homeName = await puppeteerEvaluate({ element: homeParticipant, property })
    const awayName = await puppeteerEvaluate({ element: awayParticipant, property })

    if(!homeResult || !awayResult || !homeName || !awayName) {
        console.log({
            homeResult,
            awayResult,
            homeName,
            awayName
        }, `Не удалось собрать данные матча ${url} для ${type}`)

        return null
    }

    return {
        home: {
            name: homeName,
            result: Number(homeResult),
            isWiner: Number(homeResult) > Number(awayResult)
        },
        away: {
            name: awayName,
            result: Number(awayResult),
            isWiner: Number(awayResult) > Number(homeResult)
        }
    }
}
export const getBttsCoefficients = async ({ page, selectors }) => {
    const constainerSelector = selectors.ELEMENTS.BTTS.ROW
    const bttsValueSelector = selectors.ELEMENTS.BTTS.VALUE

    const container = await puppeteerGetFirstElement({ page, selector: constainerSelector })

    if(!container) {
        return null
    }

    const bttsCoefficients = await puppeteerGetAllElements({ page: container, selector: bttsValueSelector })

    if(bttsCoefficients && bttsCoefficients.length === 2) {
        const yes = await puppeteerEvaluate({ element: bttsCoefficients[0], property: PROPERTIES.TEXT_CONTENT })
        const no = await puppeteerEvaluate({ element: bttsCoefficients[1], property: PROPERTIES.TEXT_CONTENT })

        return yes && no
            ? [yes, no]
            : []
    }

    return null
}
export const getTotalCoefficients = async ({ page, selectors }) => {
    const constainerSelector = selectors.CONTAINERS.TOTAL_ODDS
    const totalRowSelector = selectors.ELEMENTS.TOTAL.ROW
    const totalSelector = selectors.ELEMENTS.TOTAL.TOTAL
    const totalValueSelector = selectors.ELEMENTS.TOTAL.VALUE
    const totalItems = []
    const totals = {}

    const containers = await puppeteerGetAllElements({ page, selector: constainerSelector })

    if(!containers || !containers.length) {
        return null
    }

    for (let index = 0; index < containers.length; index++) {
        const container = containers[index];
        
        const totalItem = await puppeteerGetFirstElement({ page: container, selector: totalRowSelector })

        if(totalItem) {
            totalItems.push(totalItem)
        }
    }

    for (let index = 0; index < totalItems.length; index++) {
        const totalItemRow = totalItems[index];

        const totalItem = await puppeteerGetFirstElement({ page: totalItemRow, selector: totalSelector })
        const totalCoefficients = await puppeteerGetAllElements({ page: totalItemRow, selector: totalValueSelector })
        
        if(totalItem && totalCoefficients?.length === 2) {
            const total = await puppeteerEvaluate({ element: totalItem, property: PROPERTIES.TEXT_CONTENT })
            const more = await puppeteerEvaluate({ element: totalCoefficients[0], property: PROPERTIES.TEXT_CONTENT })
            const less = await puppeteerEvaluate({ element: totalCoefficients[1], property: PROPERTIES.TEXT_CONTENT })

            if(total && more && less) {
                totals[total] = [more, less]
            }
        }
    }

    return totals
}
export const getDoubleChangeCoefficients = async ({ page, selectors }) => {
    const constainerSelector = selectors.ELEMENTS.DOUBLE_CHANGE.ROW
    const doubleChangeValueSelector = selectors.ELEMENTS.DOUBLE_CHANGE.VALUE

    const container = await puppeteerGetFirstElement({ page, selector: constainerSelector })

    if(!container) {
        return null
    }

    const doubleChangeCoefficients = await puppeteerGetAllElements({ page: container, selector: doubleChangeValueSelector })

    if(doubleChangeCoefficients && doubleChangeCoefficients.length === 3) {
        const first = await puppeteerEvaluate({ element: doubleChangeCoefficients[0], property: PROPERTIES.TEXT_CONTENT })
        const second = await puppeteerEvaluate({ element: doubleChangeCoefficients[1], property: PROPERTIES.TEXT_CONTENT })
        const third = await puppeteerEvaluate({ element: doubleChangeCoefficients[2], property: PROPERTIES.TEXT_CONTENT })

        return first && second && third
            ? [first, second, third]
            : []
    }

    return null
}