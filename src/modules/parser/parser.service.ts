import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { History } from 'src/models/history.model';

import { getYesterdayDateFormatted, getNextDateFormatted, getCurrentDateFormatted, getCurrentTime, getIsFirstHalfOfDay  } from 'src/helpers/date';
import { ACTIVE_SPORTS } from 'src/constants/parser';

import { getParsedSportData } from './parser-history';
import { getHistoryUrls, getHistoryResults } from './parser-results';

@Injectable()
export class ParserService {  
    // constructor(
    //     @InjectModel('History') private readonly historyModel: Model<History>,
    //     @InjectModel('Results') private readonly resultsModel: Model<History>
    // ) {}

    async parsingData() {
        console.log('parsingData')
        const currentTime = getCurrentTime()
        const isFirstHalfOfDay = getIsFirstHalfOfDay(currentTime)

        const date = isFirstHalfOfDay
            ? getCurrentDateFormatted()
            : getNextDateFormatted()
        console.log(date, 'date')
        const data = {}

        for (let index = 0; index < ACTIVE_SPORTS.length; index++) {
            const sport = ACTIVE_SPORTS[index];
            
            const sportData = await getParsedSportData({ sport, isFirstHalfOfDay })

            data[sport] = {
                data: sportData.data,
                failedUrls: sportData.failedUrls
            }
        }

        return {
            data,
            date,
            isFirstHalfOfDay: !isFirstHalfOfDay
        }
        // await this.saveHistoryData({ data, date, isFirstHalfOfDay })
    }

    async parsingResults() {
        // const date = getYesterdayDateFormatted()
        // // const date = '11.08.24'
        // const historyDocuments = await this.findHistoryDocumentsByDate(date)

        // for (let index = 0; index < historyDocuments.length; index++) {
        //     const history = historyDocuments[index];

        //     if(!history?.data) {
        //         return
        //     }
    
        //     const urls = getHistoryUrls({ data: history.data })
        //     const data = await getHistoryResults({ data: urls })

        //     await this.saveResultsData({ data, date })
        // }
    }

    // async saveHistoryData({ data, date, isFirstHalfOfDay }) {
    //     const histrory = new this.historyModel({
    //         data,
    //         date,
    //         isFirstHalfOfDay: !isFirstHalfOfDay
    //     })

    //     await histrory.save()
    // }

    // async saveResultsData({ data, date }) {
    //     const results = new this.resultsModel({
    //         date,
    //         data
    //     })

    //     await results.save()
    // }

    // async findHistoryDocumentByDate(date: string): Promise<History> {
    //     return this.historyModel.findOne({ date }).exec();
    // }

    // async findHistoryDocumentsByDate(date: string): Promise<History[]> {
    //     return this.historyModel.find({ date }).exec();
    // }

    // async findResultsDocumentByDate(date: string): Promise<History> {
    //     return this.resultsModel.findOne({ date }).exec();
    // }
    // async findResultsDocumentsByDate(date: string): Promise<History[]> {
    //     return this.resultsModel.find({ date }).exec();
    // }
}
