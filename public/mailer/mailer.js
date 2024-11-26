"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mailer = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_templates_1 = __importDefault(require("email-templates"));
const i18next_1 = __importDefault(require("i18next"));
const paths_1 = require("../utils/paths");
class Mailer {
    transporter;
    mailer;
    constructor() {
        this.createTransporter();
        this.initializeMailer();
    }
    initializeMailer() {
        this.mailer = new email_templates_1.default({
            views: {
                root: (0, paths_1.joinRelativeToMainPath)(process.env.MAIL_TPL_PATH),
                locals: {
                    clientUrl: process.env.CLIENT_URL,
                    t: i18next_1.default.t
                },
                options: { extension: 'ejs' }
            },
            preview: false,
            send: true,
            transport: this.transporter
        });
    }
    createTransporter() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        });
    }
}
exports.Mailer = Mailer;
