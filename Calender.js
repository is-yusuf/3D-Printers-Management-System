const { google } = require('googleapis');
const credentials = require("./views/assets/credentials-cal.json")
class cal {
    constructor() {

    }
    authorize(date) {
        this.generalDate = date;
        this.startDate = new Date(date);
        this.endDay = new Date(date)
        this.endDay.setMinutes(this.endDay.getMinutes() + 60 * 16 - 1);
        this.scopes = 'https://www.googleapis.com/auth/calendar';
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
        this.spots = []

    }


    findFirstSpot(durationMinutes) {
        this.slotstart = new Date(this.generalDate);
        this.slotend = new Date(this.generalDate);
        this.slotend.setMinutes(this.slotend.getMinutes() + durationMinutes);
        while (!this.checkExactDate(this.slotstart, this.slotend)) {
            this.slotstart.setMinutes(this.slotstart.getMinutes() + 30);
            this.slotend.setMinutes(this.slotend.getMinutes() + 30);
            if (this.slotstart.getHours() > 20) {
                return false;
            }
        }
        return { start: this.slotstart, end: this.slotend }
    }
    overlaps(s_s, s_e, e_s, e_e) {
        s_s = s_s.getTime()
        s_e = s_e.getTime()
        e_s = e_s.getTime()
        e_e = e_e.getTime()
        if (s_s > e_e || s_e < e_s) {
            return false
        }
        else {
            return true
        }
    }
    convertEventArr() {
        this.eventArr.forEach((startend, index) => {

            this.eventArr[index].start = new Date(startend.start);
            // this.eventArr[index].start.setHours(this.eventArr[index].start.getHours() - 5)
            this.eventArr[index].end = new Date(startend.end);
            // this.eventArr[index].end.setHours(this.eventArr[index].end.getHours() - 5)

        })
    }
    async freeBusyStatus(date) {
        this.authorize(date);
        return this.calendar.freebusy.query(this.check).then((response) => {
            this.eventArr = response.data.calendars["c_jkea5jm4ajhefe5ot1ejnsv788@group.calendar.google.com"].busy;
            this.convertEventArr()
            return this;
        })
    }
    schedule(startDate, endDate) {
        this.event = {
            summary: `reserved`,
            location: `Makerspace`,
            description: `taken`,
            colorId: 5,
            start: {
                dateTime: startDate,
                timeZone: 'America/Chicago',
            },
            end: {
                dateTime: endDate,
                timeZone: 'America/Chicago',
            },
        }
        this.calendar.events.insert(
            { calendarId: this.calendarId, resource: this.event },
            err => {
                if (err) return console.error('Error Creating Calender Event:', err)
                return console.log('Calendar event successfully created.')
            }
        )
    }
    checkExactDate(startDate, endDate) {
        if (this.eventArr.length == 0) {
            return true
        }
        let nonoverlapwith = 0;
        this.eventArr.forEach((event) => {
            if (!this.overlaps(startDate, endDate, event.start, event.end)) {
                nonoverlapwith += 1;
            }
        })
        if (nonoverlapwith == this.eventArr.length) {
            return true
        }
        return false;
    }
    printTime(startdate, enddate) {
        console.log({ start: `${startdate.getHours()} : ${startdate.getMinutes()}` })
        console.log({ end: `${enddate.getHours()} : ${enddate.getMinutes()}` })

    }
    printEvents() {
        console.log({ eventarr: this.eventArr })
    }
}

exports.cal = cal;