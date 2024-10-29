export declare class ParserService {
    parsingData(): Promise<{
        data: {};
        date: string;
        isFirstHalfOfDay: boolean;
    }>;
    parsingResults(): Promise<void>;
}
