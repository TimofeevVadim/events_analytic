import * as mongoose from 'mongoose';
export declare const ResultsSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    date?: string;
    data?: any;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    date?: string;
    data?: any;
}>> & mongoose.FlatRecord<{
    date?: string;
    data?: any;
}> & {
    _id: mongoose.Types.ObjectId;
}>;
export interface Results {
    date: string;
    data: object;
}
