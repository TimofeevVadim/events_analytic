"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const parser_service_1 = require("../parser/parser.service");
const analytics_service_1 = require("../analytics/analytics.service");
const analytics_1 = require("../../constants/analytics");
const date_1 = require("../../helpers/date");
let AppService = class AppService {
    constructor(parserService, analyticsService) {
        this.parserService = parserService;
        this.analyticsService = analyticsService;
    }
    async onModuleInit() {
        console.log('start');
        const data = await this.parsingAndRecordSportsEvents();
        await this.getAndReacordAnalytics({ isShowResults: true, history: data });
    }
    async parsingAndRecordSportsEvents() {
        return await this.parserService.parsingData();
    }
    async parsingAndRecordResults() {
        await this.parserService.parsingResults();
    }
    async getAndReacordAnalytics({ isShowResults, history }) {
        let currentSum = 0;
        let currentCount = 0;
        let currentResult = 0;
        const currentTime = (0, date_1.getCurrentTime)();
        const isFirstHalfOfDay = (0, date_1.getIsFirstHalfOfDay)(currentTime);
        const allAnalytics = [];
        const data = {
            firstHalfOfDay: null,
            secondHalfOfDay: null
        };
        for (let index = 0; index < analytics_1.DATES_FOR_ANALYTIC.length; index++) {
            const dateAnalytics = analytics_1.DATES_FOR_ANALYTIC[index];
            const historyDocuments = [history];
            for (let index = 0; index < historyDocuments.length; index++) {
                const history = historyDocuments[index];
                const analytics = await this.analyticsService.getAnalytics({ data: history.data });
                if (history?.isFirstHalfOfDay) {
                    data.firstHalfOfDay = analytics;
                }
                else {
                    data.secondHalfOfDay = analytics;
                }
            }
            allAnalytics.push({ date: dateAnalytics, data });
        }
        for (let index = 0; index < allAnalytics.length; index++) {
            const analytic = allAnalytics[index];
            if (isFirstHalfOfDay) {
                console.log(analytic.data.secondHalfOfDay, 'secondHalfOfDay');
            }
            else {
                console.log(analytic.data.firstHalfOfDay, 'firstHalfOfDay');
            }
        }
        if (isShowResults) {
            console.log({ currentCount, currentResult, currentSum, profit: currentSum - currentCount });
        }
        return allAnalytics;
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [parser_service_1.ParserService,
        analytics_service_1.AnalyticsService])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map