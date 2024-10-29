import * as mongoose from 'mongoose'

export const ResultsSchema = new mongoose.Schema({
    date: { type: String, require: true },
    data: { type: Object, require: true },
})



export interface Results {
    date: string;
    data: object;
}