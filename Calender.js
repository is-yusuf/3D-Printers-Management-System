const { Console } = require('console');
const { google } = require('googleapis');
const credentials = require("./views/assets/credentials-cal.json")
class cal {

    constructor(date) {
        this.startDate = new Date(date);
        this.endDay = new Date(date)
        this.endDay.setMinutes(this.endDay.getMinutes() + 60 * 16 - 1);
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
        this.check = {
            auth: this.auth,
            resource: {
                timeMin: this.startDate,
                timeMax: this.endDay,
                timeZone: "America/Chicago",
                items: [{ id: this.calendarId }]
            }
        }
        this.calendar = google.calendar({
            version: 'v3',
            project: this.projectNum,
            auth: this.auth
        });
        this.freeBusyStatus(date);
    }

    printEvents() {
        console.log({ eventarr: this.eventArr })

    }
    findSpot(duration) {

        this.sliceDay(duration);
        this.startDateForSpot = new Date(this.startDate);
        this.endDate = new Date(this.startDateForSpot);
        this.endDate.setMinutes(this.endDate.getMinutes() + duration);

        this.spots.forEach(spot => {
            this.eventArr.forEach(event => {
                if (!this.overlaps(spot.start, spot.end, event.start, event.end)) {
                    this.spot.remove(spot);
                }
            })

            this.startDateForSpot.setMinutes(this.startDateForSpot.getMinutes() + duration);
            this.endDate.setMinutes(this.endDate.getMinutes() + duration);
            return this.possible;
        })


    }
    sliceDay(duration) {
        this.spots = []
        this.initialDate = new Date(this.startDate);
        this.endInitialDate = new Date(this.startDate);
        this.endInitialDate.setMinutes(this.endInitialDate.getMinutes() + duration);

        while (this.endInitialDate.getDate() == this.startDate.getDate()) {
            // console.log(`slicing dAY`)
            // console.log({ end: this.endInitialDate, start: this.initialDate })
            this.spots.push({ start: new Date(this.initialDate), end: new Date(this.endInitialDate) });
            this.endInitialDate.setMinutes(this.endInitialDate.getMinutes() + duration);
            this.initialDate.setMinutes(this.initialDate.getMinutes() + duration);
        }
    }
    overlaps(a_start, a_end, b_start, b_end) {
        if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
        if (a_start <= b_end && b_end <= a_end) return true; // b ends in a
        if (b_start < a_start && a_end < b_end) return true; // a in b
        return false;
    }

    freeBusyStatus(date) {
        // console.log({ checkmin: this.check.resource.timeMin })
        // console.log({ checkmax: this.check.resource.timeMax })
        return this.calendar.freebusy.query(this.check, async (err, response) => {
            this.eventArr = response.data.calendars["c_jkea5jm4ajhefe5ot1ejnsv788@group.calendar.google.com"].busy;
        })

    }

    schedule(startDate, duration) {
        let eventStartTime = new Date(startDate);
        let eventEndTime = new Date(eventStartTime.setMinutes(eventStartTime.getMinutes() + 45));
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