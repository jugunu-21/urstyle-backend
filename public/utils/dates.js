"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDateNow = exports.createDateAddDaysFromNow = void 0;
const createDateAddDaysFromNow = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};
exports.createDateAddDaysFromNow = createDateAddDaysFromNow;
const createDateNow = () => {
    const date = new Date();
    return date;
};
exports.createDateNow = createDateNow;
