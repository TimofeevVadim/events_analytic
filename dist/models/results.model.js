"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultsSchema = void 0;
const mongoose = require("mongoose");
exports.ResultsSchema = new mongoose.Schema({
    date: { type: String, require: true },
    data: { type: Object, require: true },
});
//# sourceMappingURL=results.model.js.map