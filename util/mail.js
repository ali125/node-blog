const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

exports.sendMail = (data, cb) => {
    const { to, subject,  text, html } = data;
    const options = {
        auth: {
            api_key: process.env.SEND_GRID_TOKEN
        }
    };
    const mailer = nodemailer.createTransport(sgTransport(options));
    let dest = [];
    if(typeof to === 'string') dest.push(to);
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

