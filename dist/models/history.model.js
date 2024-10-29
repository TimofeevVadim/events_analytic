"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistorySchema = void 0;
const mongoose = require("mongoose");
exports.HistorySchema = new mongoose.Schema({
    date: { type: String, require: true },
    data: { type: Object, require: true },
    isFirstHalfOfDay: { type: Boolean, require: false },
});
//# sourceMappingURL=history.model.js.map