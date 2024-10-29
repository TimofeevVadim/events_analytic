import { SportData } from 'src/types/parser';
export declare class AnalyticsService {
    getAnalytics({ data }: {
        data: any;
    }): Promise<any[]>;
    getAnalytic({ data, sport }: {
        data: SportData;
        sport: string;
    }): {};
    getSportBetList({ analytics }: {
        analytics: any;
    }): any;
    getFinalAnalytics(events: any): any[];
}
