"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPhoneNumber = void 0;
const firebaseAdmin_1 = __importDefault(require("./firebaseAdmin"));
async function checkPhoneNumber(phoneNumber) {
    try {
        const userRecord = await firebaseAdmin_1.default.auth().getUserByPhoneNumber(phoneNumber);
        console.log('User record found:', userRecord.toJSON());
        return true;
    }
    catch (error) {
        if (typeof error === 'object' && error !== null && 'code' in error) {
            const firebaseError = error;
            if (firebaseError.code === 'auth/user-not-found') {
                console.log('No user found with this phone number.');
                return false;
            }
        }
        console.error('Error fetching user data:', error);
        return false;
    }
}
exports.checkPhoneNumber = checkPhoneNumber;
