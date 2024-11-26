"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMail = void 0;
const winston_1 = __importDefault(require("winston"));
const mailer_1 = require("./mailer");
class UserMail extends mailer_1.Mailer {
    async signUp({ email }) {
        try {
            await this.mailer.send({
                template: 'signUp',
                message: {
                    from: '"Sign Up" <no-replay@example.com>',
                    to: email,
                    subject: 'Sign Up'
                }
            });
        }
        catch (error) {
            winston_1.default.error(error);
        }
    }
    async resetPassword({ email, accessToken }) {
        try {
            await this.mailer.send({
                template: 'resetPassword',
                message: {
                    from: '"Reset Password" <no-replay@example.com>',
                    to: email,
                    subject: 'Reset Password'
                },
                locals: {
                    accessToken
                }
            });
        }
        catch (error) {
            winston_1.default.error(error);
        }
    }
    async verification({ email, accessToken }) {
        try {
            await this.mailer.send({
                template: 'verification',
                message: {
                    from: '"Verification" <no-replay@example.com>',
                    to: email,
                    subject: 'Verification'
                },
                locals: {
                    accessToken
                }
            });
        }
        catch (error) {
            winston_1.default.error(error);
        }
    }
    async successfullyVerified({ email }) {
        try {
            await this.mailer.send({
                template: 'successfullyVerified',
                message: {
                    from: '"Successfully verified" <no-replay@example.com>',
                    to: email,
                    subject: 'Successfully verified'
                }
            });
        }
        catch (error) {
            winston_1.default.error(error);
        }
    }
    async successfullyUpdatedProfile({ email }) {
        try {
            await this.mailer.send({
                template: 'successfullyUpdatedProfile',
                message: {
                    from: '"Successfully updated profile" <no-replay@example.com>',
                    to: email,
                    subject: 'Successfully updated profile'
                }
            });
        }
        catch (error) {
            winston_1.default.error(error);
        }
    }
    async successfullyUpdatedEmail({ email }) {
        try {
            await this.mailer.send({
                template: 'successfullyUpdatedEmail',
                message: {
                    from: '"Successfully updated email" <no-replay@example.com>',
                    to: email,
                    subject: 'Successfully updated email'
                }
            });
        }
        catch (error) {
            winston_1.default.error(error);
        }
    }
    async successfullyUpdatedPassword({ email }) {
        try {
            await this.mailer.send({
                template: 'successfullyUpdatedPassword',
                message: {
                    from: '"Successfully updated password" <no-replay@example.com>',
                    to: email,
                    subject: 'Successfully updated password'
                }
            });
        }
        catch (error) {
            winston_1.default.error(error);
        }
    }
    async successfullyDeleted({ email }) {
        try {
            await this.mailer.send({
                template: 'successfullyDeleted',
                message: {
                    from: '"Successfully deleted" <no-replay@example.com>',
                    to: email,
                    subject: 'Successfully deleted'
                }
            });
        }
        catch (error) {
            winston_1.default.error(error);
        }
    }
}
exports.UserMail = UserMail;
