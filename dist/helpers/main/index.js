"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDelay = void 0;
const onDelay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.onDelay = onDelay;
//# sourceMappingURL=index.js.map