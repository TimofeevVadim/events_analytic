"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATES_FOR_ANALYTIC = exports.SPORTS_FOR_ANALYTIC = exports.FINAL_LIST_COUNT = exports.COEFFICIENT_LEVELS = exports.COEFFICIENT_NAMES = void 0;
const parser_1 = require("../parser");
exports.COEFFICIENT_NAMES = {
    FIRST: 'FIRST',
    SECOND: 'SECOND',
    THIRD: 'THIRD',
    FOURTH: 'FOURTH',
    FIFTH: 'FIFTH',
};
exports.COEFFICIENT_LEVELS = {
    [exports.COEFFICIENT_NAMES.FIRST]: 2,
    [exports.COEFFICIENT_NAMES.SECOND]: 1.8,
    [exports.COEFFICIENT_NAMES.THIRD]: 1.6,
    [exports.COEFFICIENT_NAMES.FOURTH]: 1.4,
    [exports.COEFFICIENT_NAMES.FIFTH]: 1.25,
};
exports.FINAL_LIST_COUNT = {
    FIRST: 10,
    SECOND: 10,
    THIRD: 0,
    FOURTH: 0,
    FIFTH: 0,
};
exports.SPORTS_FOR_ANALYTIC = [parser_1.SPORTS.FOOTBALL];
exports.DATES_FOR_ANALYTIC = ['24.08.24'];
//# sourceMappingURL=index.js.map