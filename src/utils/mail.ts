import sgMail, { ClientResponse } from '@sendgrid/mail';

import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID as string; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKE as string;   // Your Auth Token from www.twilio.com/console
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER as string;

import twilio from 'twilio';

// const client = twilio(accountSid, authToken, {
//     lazyLoading: true,
// });


type MailOptions = {
    to: string;
    subject: string;
    text: string;
    html: string;
};

type SendMail = (data: MailOptions, cb: (error: ClientResponse | null, response?: ClientResponse) => void) => void;

export const sendMail: SendMail = (data, cb) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

    const { to, subject, text, html } = data;
    const options = {
        auth: {
            api_key: process.env.SENDGRID_API_KEY
        }
    };
    let dest = [];
    if (typeof to === 'string') dest.push(to);
    else dest = to;
    const msg = {
        to: dest,
        from: process.env.SENDGRID_EMAIL_FROM as string,
        subject,
        text,
        html,
    };
    sgMail
        .send(msg)
        .then((response) => {
            cb(null, response[0]);
        })
        .catch((error) => {
            console.error(error)
            cb(error[0]);
        });

};

type SmsOptions = {
    to: string;
    // url?: string;
    body?: string;
};
type SendSms = (data: SmsOptions) => Promise<any>;

export const sendSms: SendSms = async (data) => {
    const client = twilio(accountSid, authToken, {
        lazyLoading: true,
    });
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
    const client = twilio(accountSid, authToken, {
        lazyLoading: true,
    });
    return await client.calls.create({
        to: data.to,
        from: (TWILIO_PHONE_NUMBER as string),
        url: data.url || undefined,
        // body: data.body || undefined,
    });
}