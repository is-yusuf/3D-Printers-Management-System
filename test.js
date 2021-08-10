

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'is.yusuf.tester@gmail.com',

        pass: '01524325232'

    }
});



console.log('created');
transporter.sendMail({
    from: 'is.yusuf.tester@gmail.com',
    to: 'phy.ysf@gmail.com',
    subject: 'hello world!',
    text: 'hello world!'
});