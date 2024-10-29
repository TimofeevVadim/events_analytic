import { OnModuleInit } from '@nestjs/common';
import { ParserService } from '../parser/parser.service';
import { AnalyticsService } from '../analytics/analytics.service';
export declare class AppService implements OnModuleInit {
    private readonly parserService;
    private readonly analyticsService;
    constructor(parserService: ParserService, analyticsService: AnalyticsService);
    onModuleInit(): Promise<void>;
    parsingAndRecordSportsEvents(): Promise<{
        data: {};
        date: string;
        isFirstHalfOfDay: boolean;
    }>;
    parsingAndRecordResults(): Promise<void>;
    getAndReacordAnalytics({ isShowResults, history }: {
        isShowResults: any;
        history: any;
    }): Promise<any[]>;
}
