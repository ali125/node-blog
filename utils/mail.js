const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const client = require('twilio')(accountSid, authToken, {
    lazyLoading: true,
});

exports.sendMail = (data, cb) => {
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

exports.sendSms = async (data) => {
    return client.messages.create({
        to: data.to,
        from: TWILIO_PHONE_NUMBER,
        url: data.url || undefined,
        body: data.body || undefined,
    })
};

exports.sendCall = async (data) => {
    return client.calls.create({
        to: data.to,
        from: TWILIO_PHONE_NUMBER,
        url: data.url || undefined,
        body: data.body || undefined,
    });
}