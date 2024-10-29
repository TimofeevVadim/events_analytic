import { SERVISES, SELECTORS, DELAY, PROPERTIES, URLS } from "src/constants/parser"
import { 
    puppeteerLaunch,
    puppeteerBrowserClose,
    puppeteerMoveToNewLink,
    puppeteerGetAllElements,
    puppeteerEvaluate
} from "src/helpers/puppeteer"

export const getHistoryUrls = ({ data }) => {
    if(!data) {
        return []
    }

    const urls = {}
    const sports = Object.keys(data)

    for (let index = 0; index < sports.length; index++) {
        const sport = sports[index];
        const history = data[sport]
        const sportData = {}

        const sportDataKeys = history?.data
            ? Object.keys(history?.data)
            : []

        sportDataKeys.forEach(key => {
            const { url, time, names, name } = history.data[key]

            sportData[key] = {
                url,
                time,
                names,
                name
            }
        })

        urls[sport] = sportData
    }

    return urls
}

export const getHistoryResults = async ({ data }) => {
    if(!data) {
        return null
    }

    const results = {}
    const sports = Object.keys(data)
    const service = SERVISES.FLASH_SCORE
    const serviceUrl = URLS[service].MATCH_URL

    const { page, browser } = await puppeteerLaunch({ url: serviceUrl, selector: '' })
    let lastUrl = serviceUrl

    for (let index = 0; index < sports.length; index++) {
        const sport = sports[index];
        const sportData = data[sport]
        const selectors = SELECTORS[service][sport]
        const sportResults = {}

        const sportDataKeys = Object.keys(sportData)

        console.log(`Найдено ${sportDataKeys.length} матчей для ${sport}`)
        
        for (let index = 0; index < sportDataKeys.length; index++) {
            const eventName = sportDataKeys[index];
            const event = sportData[eventName]
            lastUrl = event?.url

            const moveResult = await puppeteerMoveToNewLink({ page, url: lastUrl, delay: DELAY.CLICK_TO_H2H })

            if(moveResult) {
                const resultsSelector = selectors.ELEMENTS.RESULTS

                const results = await puppeteerGetAllElements({ page, selector: resultsSelector })

                if(results && results.length === 3) {
                    const home = await puppeteerEvaluate({ element: results[0], property: PROPERTIES.TEXT_CONTENT })
                    const away = await puppeteerEvaluate({ element: results[2], property: PROPERTIES.TEXT_CONTENT })
                    
                    if(home && away) {
                        sportResults[eventName] = {
                            ...event,
                            results: {
                                home,
                                away
                            }
                        }
                        console.log(`${home}/${away}  `, lastUrl)
                    } else {
                        console.log(`Не удалось получить результаты по урлу ${lastUrl}`)
                    }
                }
            } else {
                console.log(`Не удалось открыть ссылку ${lastUrl}`)
            }
        }

        results[sport] = sportResults
    }

    await puppeteerBrowserClose({ browser, url: lastUrl })

    return results
}