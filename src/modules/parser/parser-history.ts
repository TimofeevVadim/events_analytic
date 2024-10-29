import { 
    URLS,
    SERVISES,
    SELECTORS,
    PROPERTIES,
    MAX_CLICK_TO_SHOW_MORE,
    H2H_SECTION_INDEX,
    OTHER_TABS,
    H2H_TYPES,
    TABS,
    DELAY,
    SPORTS
 } from 'src/constants/parser';
import { 
    getMatchUrl,
    getCoefficients,
    getMatchTime,
    getNames,
    getH2HTab,
    getHistoryMatchDate,
    getHistoryMatchEvent,
    getHistoryMatchResylt,
    getBttsCoefficients,
    getTotalCoefficients,
    getDoubleChangeCoefficients
} from 'src/helpers/parser';
import { 
    puppeteerLaunch,
    puppeteerBrowserClose,
    puppeteerGetFirstElement,
    puppeteerClickToElement,
    puppeteerGetAllElements,
    puppeteerEvaluate,
    puppeteerMoveToNewLink,
    puppeteerGetCurrentUrl
} from 'src/helpers/puppeteer';
import { getCurrentDateFormatted, getIsFirstHalfOfDay } from 'src/helpers/date';

export const getParsedSportData = async ({ sport, isFirstHalfOfDay }) => {
    const service = SERVISES.FLASH_SCORE
    const selectors = SELECTORS[service][sport]
    const url = URLS[service][sport]
    const waitingSelector = selectors.WAITING_TO_LOAD.FIRST_BOOT

    const { page, browser } = await puppeteerLaunch({ url, selector: waitingSelector })

    // Получаем список всех матчей на странице
    const items = await getSportItems({ selectors, page, isFirstHalfOfDay })

    console.log(`Всего найдено ${items.length} матчей для ${sport}`)

    // Получаем список урлов, для страницы каждого матча
    const matchUrls = await getMatchUrls({ items, service, selectors, isFirstHalfOfDay })

    console.log(`На следующую половину дня найдено ${matchUrls.length} матчей для ${sport}`)
    
    // Получаем данные по каждому из матчей
    const { data, failedUrls } = await processingAvailableMatches({ items: matchUrls, page, selectors, sport, service })

    await puppeteerBrowserClose({ browser, url })

    return { data, failedUrls }
}
// Возвращает список найденых матчей
export const getSportItems = async ({ selectors, page, isFirstHalfOfDay }) => {
    const clickResult = !isFirstHalfOfDay
        ? await onSwitchToTomorrow({ page, selectors })
        : null

    if(!isFirstHalfOfDay && !clickResult) {
        return []
    }

    // Получаем основной контейнер
    const mainSelector = selectors.CONTAINERS.ITEMS

    const mainContainer = await puppeteerGetFirstElement({ page, selector: mainSelector })

    if(!mainContainer) {
        return []
    }

    // Получаем кнопки раскрытия списка матчей, если есть
    const showMoreLeagueSelector = selectors.BUTTONS.LEAGUE_SHOW_MORE

    const showMoreLeagueItems = await puppeteerGetAllElements({ page: mainContainer, selector: showMoreLeagueSelector })

    if(showMoreLeagueItems?.length) {
        await clickToLeagueShowMore({ page, elements: showMoreLeagueItems, selectors })
    }

    const itemSelector = selectors.ELEMENTS.ITEM
    const items = await puppeteerGetAllElements({ page: mainContainer, selector: itemSelector })

    return items
}
// Получаем урлы матчей для парсинга
export const getMatchUrls = async ({ items, service, selectors, isFirstHalfOfDay }) => {
    const property = PROPERTIES.ID
    const tab = TABS.H2H
    const urls = []

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        const timeSelector = selectors.ELEMENTS.EVENT_TIME
        const stageSelector = selectors.ELEMENTS.EVENT_STAGE

        const stageBlock = await puppeteerGetFirstElement({ page: item, selector: stageSelector })

        const timeBlock = !stageBlock 
            ? await puppeteerGetFirstElement({ page: item, selector: timeSelector })
            : null

        const time = timeBlock
            ? await puppeteerEvaluate({ element: timeBlock, property: PROPERTIES.TEXT_CONTENT })
            : null

        const isMorningEvent = time
            ? getIsFirstHalfOfDay(time)
            : null

        const isRightEvent = isMorningEvent !== isFirstHalfOfDay

        const id = await puppeteerEvaluate({ element: item, property })
        const url = getMatchUrl({ id, service, tab })

        if(url && !stageBlock && isRightEvent) {
            urls.push({ id, url })
        }
    }

    return urls
}
// Открываем страницу каждого матча, для дальнейшего парсинга
export const processingAvailableMatches = async ({ items, page, selectors, sport, service }) => {
    const waitingSelector = selectors.WAITING_TO_LOAD.MATCH_PAGE
    const failedUrls: string[] = [];
    let data = {}

    for (let i = 0; i < items.length; i++) {
        const { id, url } = items[i]

        const isPageMove = await puppeteerMoveToNewLink({ page, url, waitingSelector })

        if(isPageMove) {
            const matchData = await parseMatchData({ page, selectors, url, sport, id, service })
      
            if(matchData) {
            
                console.log(`Получены данные для ${i} из ${items.length} матчей ${sport}`)

                data[matchData.name] = matchData
            }
        } else {
            failedUrls.push(url)
        }
    }

    if(failedUrls.length) {
        console.log(`Остался список не открытых урлов, в количестве ${failedUrls.length}`)
    }

    return { data, failedUrls }
}
// Парсит данные по текущему матчу
export const parseMatchData = async ({ page, selectors, url, sport, id, service }) => {
    const coefficients = await getCoefficients({ page, selectors, sport })

    if(!coefficients) {
        return null
    }

    const names = await getNames({ page, selectors, sport })
    const time = await getMatchTime({ page, selectors })

    console.log(time, 'time')

    if(!names || !time) {
        return null
    }

    // Переключаем на секцию H2H
    const clickH2HResult = await onClickToH2H({ page, selectors })

    if(!clickH2HResult) {
        return null
    }

    // Раскрывает списки матчей
    await clickToShowMore({ page, selectors })

    // Получаем историю игр из секции H2H
    const history = await getH2hHistory({ page, selectors, url })

    if(!history) {
        return null
    }

    const otherCoefficients = await getOtherCoefficients({ id, page, selectors, sport, service })

    return {
        name: `${names.home}/${names.away}`,
        url,
        coefficients,
        otherCoefficients,
        names,
        time,
        home: history.home,
        away: history.away,
        games: history.games
    }
}
export const getOtherCoefficients = async ({ id, page, selectors, sport, service }) => {
    if(![SPORTS.FOOTBALL].includes(sport)) {
        return null
    }

    const otherCoefficients = {}
    const tabs = OTHER_TABS[sport]

    for (let index = 0; index < tabs.length; index++) {
        const tab = tabs[index];
        const url = getMatchUrl({ id, service, tab })

        const moveResult = await puppeteerMoveToNewLink({ page, url, delay: 500 })
        const currentUrl = await puppeteerGetCurrentUrl({ page })

        const isPageMove = moveResult
            && currentUrl === url

        if(isPageMove && tab === TABS.BTTS) {
            otherCoefficients[tab] = await getBttsCoefficients({ page, selectors })
        }

        if(isPageMove && tab === TABS.TOTAL) {
            otherCoefficients[tab] = await getTotalCoefficients({ page, selectors })
        }

        if(isPageMove && tab === TABS.DOUBLE_CHANGE) {
            otherCoefficients[tab] = await getDoubleChangeCoefficients({ page, selectors })
        }
    }

    return otherCoefficients
}
// Переходит на страницу матчей на завтра
export const onSwitchToTomorrow = async ({ page, selectors}) => {
    const buttonSelector = selectors.BUTTONS.TOMORROW
    const calendarSelector = selectors.ELEMENTS.CALENDAR
    const waitForSelector = selectors.WAITING_TO_LOAD.CLICK_TO_TOMORROW
    const delay = DELAY.CLICK_TO_TOMOROW

    const block = await puppeteerGetFirstElement({ page, selector: calendarSelector })
    const clickResult = await puppeteerClickToElement({
        selector: buttonSelector,
        waitForSelector,
        block,
        page,
        delay
    })

    return clickResult
}
export const onClickToH2H = async ({ page, selectors }) => {
    const buttonSelector = selectors.BUTTONS.H2H.TAB
    const waitForSelector  = selectors.WAITING_TO_LOAD.H2H
    const delay = DELAY.CLICK_TO_H2H

    const block = await getH2HTab({ page, selectors })

    const clickH2HResult = await puppeteerClickToElement({
       selector: buttonSelector,
       waitForSelector,
       block,
       page,
       delay,
       message: false
   })

   return clickH2HResult
}
export const clickToShowMore = async ({ page, selectors }) => {
    const sectionsSelector = selectors.CONTAINERS.H2H.SECTIONS
    const buttonSelectors = selectors.BUTTONS.H2H.SHOW_MORE
    const buttonSelector = selectors.BUTTONS.H2H.SHOW_MORE_BTN
    const delay = DELAY.CLICK_TO_SHOW_MORE

    for (let i = 0; i < MAX_CLICK_TO_SHOW_MORE; i++) {
      const sections = await puppeteerGetAllElements({ page, selector: sectionsSelector })
      const buttons = await puppeteerGetAllElements({ page, selector: buttonSelectors })

      if(!buttons?.length) {
        i = MAX_CLICK_TO_SHOW_MORE
      }

      for (let index = 0; index < sections.length; index++) {
        const section = sections[index]
        const button = await puppeteerGetFirstElement({ page: section, selector: buttonSelector })

        if(button) {
            await puppeteerClickToElement({ 
                selector: buttonSelector,
                currentElement: button,
                page,
                delay,
                message: false
            })
        }
      }
    }
}
export const clickToLeagueShowMore = async ({ page, elements, selectors }) => {
    const buttonSelector = selectors.BUTTONS.LEAGUE_SHOW_MORE
    const delay = 1500

    for (let index = 0; index < elements.length; index++) {
        const button = elements[index]

        await puppeteerClickToElement({ 
            selector: buttonSelector,
            currentElement: button,
            page,
            delay,
            message: false
        })
      }
}
export const getH2hHistory = async ({ page, selectors, url }) => {
    const sectionRows = selectors.CONTAINERS.H2H.SECTION_ROWS

    const sections = await puppeteerGetAllElements({ page, selector: sectionRows })

    if(sections.length < 3) {
        return null
    }

    const homeHistory = await getHistoryData({ section: sections[H2H_SECTION_INDEX.HOME], selectors, url, type: H2H_TYPES.HOME })
    const awayHistory = await getHistoryData({ section: sections[H2H_SECTION_INDEX.AWAY], selectors, url, type: H2H_TYPES.AWAY })
    const gamesHistory = await getHistoryData({ section: sections[H2H_SECTION_INDEX.GAME], selectors, url, type: H2H_TYPES.GAMES })

    if(!homeHistory.length || !awayHistory.length) {
        return null
    }

    return {
        home: homeHistory,
        away: awayHistory,
        games: gamesHistory
    }
}
export const getHistoryData = async ({ section, selectors, url, type }) => {
    const currentDate = getCurrentDateFormatted()
    const h2hRow = selectors.ELEMENTS.H2H.ROW
    const items = await puppeteerGetAllElements({ page: section, selector: h2hRow })
    
    const history = []

    for (let i = 0; i < items.length; i++) {
        const match = items[i];

        const date = await getHistoryMatchDate({ section: match, selectors })

        const isCurrentMatch = false
        // const isCurrentMatch = date === currentDate


        const event = await getHistoryMatchEvent({ section: match, selectors })
        const result = await getHistoryMatchResylt({ section: match, selectors, url, type })
        
        if(!isCurrentMatch && date && event && result) {
            const name = `${result.home.name}/${result.away.name}`
            const data = {
                name,
                date,
                event,
                ...result
            }

            history.push(data)
        } else if(isCurrentMatch){
            console.log(`Матч не добавлен в историю так как он прошел сегодня ${url}`)
        } else {
            console.log({date, event, result}, `Не удалось собрать данные для матча ${url}`)
        }
    }

    return history
}