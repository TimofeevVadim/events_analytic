import * as mongoose from 'mongoose'

export const HistorySchema = new mongoose.Schema({
    date: { type: String, require: true },
    data: { type: Object, require: true },
    isFirstHalfOfDay: { type: Boolean, require: false },
})

export interface History {
    date: string;
    data: object;
    isFirstHalfOfDay: boolean;
}