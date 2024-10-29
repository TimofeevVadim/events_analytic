import * as mongoose from 'mongoose';
export declare const HistorySchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    date?: string;
    data?: any;
    isFirstHalfOfDay?: boolean;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    date?: string;
    data?: any;
    isFirstHalfOfDay?: boolean;
}>> & mongoose.FlatRecord<{
    date?: string;
    data?: any;
    isFirstHalfOfDay?: boolean;
}> & {
    _id: mongoose.Types.ObjectId;
}>;
export interface History {
    date: string;
    data: object;
    isFirstHalfOfDay: boolean;
}
