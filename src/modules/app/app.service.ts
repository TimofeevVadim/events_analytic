import { Injectable, OnModuleInit } from '@nestjs/common';
import { ParserService } from '../parser/parser.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { DATES_FOR_ANALYTIC } from 'src/constants/analytics';
import { getCurrentTime, getIsFirstHalfOfDay } from 'src/helpers/date';
import { getResults } from 'src/helpers/analytic';

@Injectable()
export class AppService implements OnModuleInit  {
  constructor(
    private readonly parserService: ParserService,
    private readonly analyticsService: AnalyticsService
  ) {}

  async onModuleInit() {
    console.log('start')
    const data = await this.parsingAndRecordSportsEvents()
    // await this.parsingAndRecordResults()
    await this.getAndReacordAnalytics({ isShowResults: true, history: data })
  }
  // Парсит и записывает данные
  async parsingAndRecordSportsEvents() {
    return await this.parserService.parsingData()
  }
  // Парсит и записывает результаты
  async parsingAndRecordResults() {
    await this.parserService.parsingResults()
  } 
  // Получает и записывает аналитику
  async getAndReacordAnalytics({ isShowResults, history }) {
    let currentSum = 0
    let currentCount = 0
    let currentResult = 0
    const currentTime = getCurrentTime()
    const isFirstHalfOfDay = getIsFirstHalfOfDay(currentTime)

    const allAnalytics = []

    const data = {
      firstHalfOfDay: null,
      secondHalfOfDay: null
    }

    for (let index = 0; index < DATES_FOR_ANALYTIC.length; index++) {
      const dateAnalytics = DATES_FOR_ANALYTIC[index];
      
      // const historyDocuments = await this.parserService.findHistoryDocumentsByDate(dateAnalytics)
      // const results = await this.parserService.findResultsDocumentsByDate(dateAnalytics)
      const historyDocuments = [history]
      for (let index = 0; index < historyDocuments.length; index++) {
        const history = historyDocuments[index];

        const analytics = await this.analyticsService.getAnalytics({ data: history.data })

        if(history?.isFirstHalfOfDay) {
          data.firstHalfOfDay = analytics
        } else {
          data.secondHalfOfDay = analytics
        }

        // if(isShowResults) {
        //   const { sum, count, result } = await getResults({ analytics, results })

        //   console.log({ sum, count, result })
  
        //   currentSum = currentSum + sum
        //   currentCount = currentCount + count
        //   currentResult = currentResult + result
        // }
      }

      allAnalytics.push({ date: dateAnalytics, data })
    }

    for (let index = 0; index < allAnalytics.length; index++) {
      const analytic = allAnalytics[index];
      
      if(isFirstHalfOfDay) {
        console.log(analytic.data.secondHalfOfDay, 'secondHalfOfDay')
      } else {
        console.log(analytic.data.firstHalfOfDay, 'firstHalfOfDay')
      }
    }

    if(isShowResults) {
      console.log({ currentCount, currentResult, currentSum, profit: currentSum - currentCount })
    }

    return allAnalytics
  }
}
