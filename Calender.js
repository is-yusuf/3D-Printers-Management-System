const { google } = require('googleapis');
const credentials = require("./views/assets/credentials-cal.json")
class cal {

    constructor(date) {
        this.authorize(date);
    }
    authorize(date) {
        this.scopes = 'https://www.googleapis.com/auth/calendar.readonly';
        this.privateKey = credentials.private_key;
        this.clientEmail = credentials.client_email;
        // this.projectNum = "<1046718051743>"
        this.calendarId = "c_jkea5jm4ajhefe5ot1ejnsv788@group.calendar.google.com"
        this.auth = new google.auth.JWT(
            this.clientEmail,
            null,
            this.privateKey,
            this.scopes
        );
        this.calendar = google.calendar({
            version: 'v3',
            project: this.projectNum,
            auth: this.auth
        });
        this.check = {
            auth: this.auth,
            resource: {
                timeMin: 0,
                timeMax: 0,
                timeZone: "America/Chicago",
                items: [{ id: this.calendarId }]
            }
        }
        this.eventArr = this.freeBusyStatus(date, 60 * 24);


    }
    printEvents() {
        console.log({ eventarr: this.eventArr })

    }

    freeBusyStatus(date, duration) {
        const endDate = new Date(date)
        endDate.setMinutes(endDate.getMinutes() + duration);
        this.check.resource.timeMin = new Date(date);
        this.check.resource.timeMax = endDate;

        return this.calendar.freebusy.query(this.check, async (err, response) => {
            this.eventArr = response.data.calendars["c_jkea5jm4ajhefe5ot1ejnsv788@group.calendar.google.com"].busy;
            return response.data.calendars["c_jkea5jm4ajhefe5ot1ejnsv788@group.calendar.google.com"].busy;
        })
    }

    schedule(startDate, duration) {
        let eventStartTime = startDate;
        let eventEndTime = eventStartTime.setMinutes(eventStartTime.getMinutes() + 45);
        this.event.start.dateTime = eventStartTime;
        this.event.end.dateTime = eventEndTime;
        calendar.events.insert(
            { calendarId: 'primary', resource: this.event },
            err => {
                // Check for errors and log them if they exist.
                if (err) return console.error('Error Creating Calender Event:', err)
                // Else log that the event was created.
                return console.log('Calendar event successfully created.')
            }
        )
    }
}

exports.cal = cal;