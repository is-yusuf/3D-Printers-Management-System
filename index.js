const express = require('express');
const { google } = require('googleapis');

const app = express();
const port = 3000;

const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
const GOOGLE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCMBgrwMIlPMgP9\nWzmvUfD2kg4WfSrcTU3FAh9c0V33HtS8vU4/AsucKxkYeBiriVCjrd7eGf2ZgUJv\nO/nQan+OmAHA+6NKglUydHRW97je3T4RXtZWFVrgmYP1+VJFjK4q5DPG28g/Z1ZF\nEqSVwEuh6Bi2xf/tVBOetDGsG6IMBcaIbuVxgM33gF1X2L1lshu3a7o8NZGtWqZd\nBMihjOjghh4GOm2PKt+iOGYFmSjUzL+EjKI24AtvmgtLrlOw4XcKHoymaZ2GecNi\nollM+MyuM2p0XnyaZ2DXgGrciMfTTRKEjDU8rpGGxjTxmRi1t1b83nJo0es22DUk\ng/WVMafJAgMBAAECggEAGp7VeoeHu04zcvnidCHccUwgMIdYXCy4MdGu+7r0JdSv\nNji5RQJ3ijepXD0M16PR+GRIYCpJy+LGqhYZbtWobYgZoUJV74bqwp5gNd5/v6MJ\nN00z64bA0b1t2JgvW3ic7huXemFzZxZy0Mv0DWJTHrNc63amKs0Ws8/nN6TDQIya\nfVbkYc/dq1zO+6nxIAjWRb4cu0KRLgGH81wA2kn4ony+sLUB1j4iT9vCE9u61A7X\nfFM5Vk6DEGRUgUBxb65a4nTYSloUG4a/57Bu6A1Vt9//HIKLNVxB+Qr4Bkhf0J6L\nyAMWWQlHM6SxA6rOA8+sY94q/tuNM49mRqWub2yyzwKBgQDFksknVxmyQ/xCSZ6U\nmHEh0HWY2Mfg9Dvm0wzcJDPB2AVeLqK1g0Kcy2Tqz5rCk/VLX7CA38pWZyY5/wzN\nEdLN5XNZP29B5btOgrzAPdYHi1C3WZN6FUy0MJLGTZBSDTrN0ya2gFGc3/8HjDFO\nGfZl21Ek0dTQgWLJgPxxEWa9GwKBgQC1bnlWPw2BR16fI8g2Yi+4lUAG1aaoLJup\ndsIjhyRueXhvRQ+LrmvErvGal+mSVx7x0EvRbHTR5ITFRyVmcV2xFp7WQrdI010G\nr0GVOjzRS6fipjgGhKnDoJIA84Rr2ZAJMvyD5pVu7PzkoiJxadJXOeNgH03PX13Q\n2akBwRcw6wKBgQCCzRcXUHbWqmPLjunJ/tKHTHdOZdaOe6NcwcT1yZHqd5W2MLHP\n8cKcA5wgSKlwwHvZFtTHvWE7qraIFu7mpTIm1g1zvKdvvSQwaiWEMGwOOpGJkWgt\nnwRVFwNU/ezaJaAUvAIZOQLPFQzGdm3+Avo5nOUvtytpjv9T4G1AfgDCmQKBgAn7\nmCWMtpuEZ8pt15hWcrW/UJSPsOnT+oSqiigWSYTiniPRMvfGkxtxXM3ayflJXeSE\nR4ewZgUeg8evEHnAhx01V2wGo7sYFihGAF/LookJlqU77B0/s2+WKDJxM7oTcH9x\nFL/VMie2VnvmB+shnXc7Mi2Zy1g7sRfKwifcjgAdAoGATnhr6q7pJ0h2e86CMMsS\nN89XhT4LkrwZCMH6i5Q+WyHGxnnNKbkOqqpIVOgXlQDOR+louVEGDNaGeQo55Hyh\nIaAbp6Ajvkt8smsj4yrEcMxzfJ4Rn5tpgIRHXOXDT5b2EdUZtMTxpcFDkOvlyZUx\nxOmfSK63zqDnlNxpkcqOy94=\n-----END PRIVATE KEY-----\n";
const GOOGLE_CLIENT_EMAIL = "calender-editor@privatespreadsheeteditor.iam.gserviceaccount.com"
const GOOGLE_PROJECT_NUMBER = "<1046718051743>"
const GOOGLE_CALENDAR_ID = "c_jkea5jm4ajhefe5ot1ejnsv788@group.calendar.google.com"

app.get('/', (req, res) => {
    const jwtClient = new google.auth.JWT(
        GOOGLE_CLIENT_EMAIL,
        null,
        GOOGLE_PRIVATE_KEY,
        SCOPES
    );

    const calendar = google.calendar({
        version: 'v3',
        project: GOOGLE_PROJECT_NUMBER,
        auth: jwtClient
    });

    calendar.events.list({
        calendarId: GOOGLE_CALENDAR_ID,
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (error, result) => {
        if (error) {
            res.send(JSON.stringify({ error: error }));
        } else {
            if (result.data.items.length) {
                res.send(JSON.stringify({ events: result.data.items }));
            } else {
                res.send(JSON.stringify({ message: 'No upcoming events found.' }));
            }
        }
    });
});


app.get('/check', (req, res) => {
    const jwtClient = new google.auth.JWT(
        GOOGLE_CLIENT_EMAIL,
        null,
        GOOGLE_PRIVATE_KEY,
        SCOPES
    );

    const calendar = google.calendar({
        version: 'v3',
        project: GOOGLE_PROJECT_NUMBER,
        auth: jwtClient
    });

    let eventStartTime = new Date("2021 - 07 - 30T00: 00:00.000Z");

    let eventEndTime = eventStartTime.setMinutes(eventStartTime.getMinutes() + 30);

    freeBusyStatus(jwtClient, "c_jkea5jm4ajhefe5ot1ejnsv788@group.calendar.google.com");

    function freeBusyStatus(auth, calendarId) {
        const startDate = new Date('29 July 2021 12:00').toISOString()
        const endDate = new Date('30 July 2021 18:00').toISOString()
        const check = {
            auth: auth,
            resource: {
                timeMin: startDate,
                timeMax: endDate,
                timeZone: "America/Chicago",
                items: [{ id: calendarId }]
            }
        }

        calendar.freebusy.query(check, function (err, response) {
            if (err) {
                console.log('error: ' + err)
            } else {
                const eventArr = response.data.calendars["c_jkea5jm4ajhefe5ot1ejnsv788@group.calendar.google.com"];
                console.log(eventArr);

            }
        })
    }
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`));