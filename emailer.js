const { content } = require('googleapis/build/src/apis/content');
const fetch = require('node-fetch');
const credentials = require("./credentials-cal.json")

exports.sendMail = sendMail;
/**
 * 
 * @param {String} email The email to be sent to 
 * @param {String} content The content of the email 
 * @param {String} name The name of reciepent optional and defaults to MakerSpace User 
 * @param {number} milliseconds The number of milliseconds from now to send the email. Optinoal defaults to 0. 
 */
function sendMail(email, content, name = "MakerSpace User", milliseconds = 0) {
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
                "email": "ajhg@carleton.edu",
                "name": "Aaron Heidgerken-Greene"
            },
            send_at: milliseconds
        })

    }).then(res => {
        console.log({ status: res.status })
    })
}