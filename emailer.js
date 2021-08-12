const { content } = require('googleapis/build/src/apis/content');
const fetch = require('node-fetch');
const credentials = require("./views/assets/credentials-cal.json")
exports.sendMail = function sendMail() {

    fetch("https://api.sendgrid.com/v3/mail/send", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials.sendGrid}`,
        },
        from: {
            "email": "no-reply@admin.make-it.cc",
            "name": "Sam Smith"
        },
        body: JSON.stringify({
            from: {
                "email": "no-reply@admin.make-it.cc",
                "name": "Sam Smith"
            },

            "personalizations":
                [{
                    "to": [{
                        "email": "ismaily@carleton.edu",
                        "name": "John Doe"
                    }],
                    "subject": "Hello, World!"
                }],

            "content": [{
                "type": "text/plain",
                "value": "Heya!"
            }],
            from: {
                "email": "no-reply@admin.make-it.cc",
                "name": "Sam Smith"
            },

            reply_to: {
                "email": "sam.smith@example.com",
                "name": "Sam Smith"
            }

        })

    }).then(res => {
        // console.log(res)
    })
}
