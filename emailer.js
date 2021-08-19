const { content } = require('googleapis/build/src/apis/content');
const fetch = require('node-fetch');
const credentials = require("./credentials-cal.json")
exports.sendMail = function sendMail(email, name, content, milliseconds) {
    // console.log({ email, name, content, milliseconds });
    fetch("https://api.sendgrid.com/v3/mail/send", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials.sendGrid}`,
        },

        body: JSON.stringify({
            from: {
                "email": "no-reply@admin.make-it.cc",
                "name": "Maker-Space"
            },
            "personalizations":
                [{
                    "to": [{
                        "email": email,
                        "name": name
                    }],
                    "subject": "Hello, World!"
                }],

            "content": [{
                "type": "text/plain",
                "value": content
            }],
            reply_to: {
                "email": "sam.smith@example.com",
                "name": "Sam Smith"
            },

        })

    }).then(res => {
        console.log({ status: res.status })
    })
}