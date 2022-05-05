"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCall = exports.sendSms = exports.sendMail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKE; // Your Auth Token from www.twilio.com/console
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const twilio_1 = __importDefault(require("twilio"));
const sendMail = (data, cb) => {
    mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
    const { to, subject, text, html } = data;
    const options = {
        auth: {
            api_key: process.env.SENDGRID_API_KEY
        }
    };
    let dest = [];
    if (typeof to === 'string')
        dest.push(to);
    else
        dest = to;
    const msg = {
        to: dest,
        from: process.env.SENDGRID_EMAIL_FROM,
        subject,
        text,
        html,
    };
    mail_1.default
        .send(msg)
        .then((response) => {
        cb(null, response[0]);
    })
        .catch((error) => {
        console.error(error);
        cb(error[0]);
    });
};
exports.sendMail = sendMail;
const sendSms = async (data) => {
    const client = (0, twilio_1.default)(accountSid, authToken, {
        lazyLoading: true,
    });
    return await client.messages.create({
        to: data.to,
        from: TWILIO_PHONE_NUMBER,
        // url: data.url || undefined,
        body: data.body || undefined,
    });
};
exports.sendSms = sendSms;
const sendCall = async (data) => {
    const client = (0, twilio_1.default)(accountSid, authToken, {
        lazyLoading: true,
    });
    return await client.calls.create({
        to: data.to,
        from: TWILIO_PHONE_NUMBER,
        url: data.url || undefined,
        // body: data.body || undefined,
    });
};
exports.sendCall = sendCall;
