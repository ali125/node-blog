import nodemailer, { SentMessageInfo } from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

import twilio from 'twilio';

const client = twilio(accountSid, authToken, {
    lazyLoading: true,
});

type MailOptions = {
    to: string;
    subject: string;
    text: string;
    html: string;
};

type SendMail = (data: MailOptions, cb: (err: Error | null, info: SentMessageInfo) => void) => void;

export const sendMail: SendMail = (data, cb) => {
    const { to, subject, text, html } = data;
    const options = {
        auth: {
            api_key: process.env.SEND_GRID_TOKEN
        }
    };
    const mailer = nodemailer.createTransport(sgTransport(options));
    let dest = [];
    if (typeof to === 'string') dest.push(to);
    else dest = to;
    const email = {
        to: dest,
        from: 'ali.mortazavi121@gmail.com',
        subject,
        text,
        html,
    };
    return mailer.sendMail(email, cb);
};

type SmsOptions = {
    to: string;
    // url?: string;
    body?: string;
};
type SendSms = (data: SmsOptions) => Promise<any>;

export const sendSms: SendSms = async (data) => {
    return await client.messages.create({
        to: data.to,
        from: TWILIO_PHONE_NUMBER,
        // url: data.url || undefined,
        body: data.body || undefined,
    })
};

type callOptions = {
    to: string;
    url?: string;
    // body?: string;
};
type SendCall = (data: callOptions) => Promise<any>;

export const sendCall: SendCall = async (data) => {
    return await client.calls.create({
        to: data.to,
        from: (TWILIO_PHONE_NUMBER as string),
        url: data.url || undefined,
        // body: data.body || undefined,
    });
}