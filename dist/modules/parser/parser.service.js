"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserService = void 0;
const common_1 = require("@nestjs/common");
const date_1 = require("../../helpers/date");
const parser_1 = require("../../constants/parser");
const parser_history_1 = require("./parser-history");
let ParserService = class ParserService {
    async parsingData() {
        console.log('parsingData');
        const currentTime = (0, date_1.getCurrentTime)();
        const isFirstHalfOfDay = (0, date_1.getIsFirstHalfOfDay)(currentTime);
        const date = isFirstHalfOfDay
            ? (0, date_1.getCurrentDateFormatted)()
            : (0, date_1.getNextDateFormatted)();
        console.log(date, 'date');
        const data = {};
        for (let index = 0; index < parser_1.ACTIVE_SPORTS.length; index++) {
            const sport = parser_1.ACTIVE_SPORTS[index];
            const sportData = await (0, parser_history_1.getParsedSportData)({ sport, isFirstHalfOfDay });
            data[sport] = {
                data: sportData.data,
                failedUrls: sportData.failedUrls
            };
        }
        return {
            data,
            date,
            isFirstHalfOfDay: !isFirstHalfOfDay
        };
    }
    async parsingResults() {
    }
};
ParserService = __decorate([
    (0, common_1.Injectable)()
], ParserService);
exports.ParserService = ParserService;
//# sourceMappingURL=parser.service.js.map