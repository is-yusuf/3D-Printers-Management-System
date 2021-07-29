const { google } = require('googleapis');
const credentials = require("./views/assets/credentials-cal.json")
class cal {

    constructor() {
        this.authorize();
        this.empty = null;
    }
    authorize() {
        // console.log('authorizing');
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
    }

    async freeBusyStatus(date, duration) {
        // console.log("just entered program");
        const startDate = new Date(date)
        const endDate = new Date(date);
        // endDate.setDate()
        endDate.setMinutes(endDate.getMinutes() + duration + 1);
        this.check.resource.timeMin = startDate;
        this.check.resource.timeMax = endDate;
        // console.log(this.check)

        await this.getEvents().then((res) => {
            this.empty = res;
            // console.log({ res })
        })
        return this.empty;
    }


    async getEvents() {
        let _this = this;
        await _this.calendar.freebusy.query(this.check, function (err, response) {
            console.log("making the query")
            if (err) { console.log('error: ' + err) }
            else {
                const eventArr = response.data.calendars["c_jkea5jm4ajhefe5ot1ejnsv788@group.calendar.google.com"].busy;
                console.log({ eventArr })
                if (eventArr.length == 0) {
                    _this.empty = true;
                }
                else {
                    _this.empty = false;
                }
            }
        })
        return this.empty
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