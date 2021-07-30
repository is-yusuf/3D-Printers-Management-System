const { Console } = require('console');
const { response } = require('express');
const { google } = require('googleapis');
const credentials = require("./views/assets/credentials-cal.json")
var EventEmitter = require('events').EventEmitter;
var util = require('util');
class cal {
    constructor(date) {
        this.startDate = new Date(date);
        this.endDay = new Date(date)
        this.endDay.setMinutes(this.endDay.getMinutes() + 60 * 16_1);
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
        this.spots = []

    }

    printEvents() {
        console.log({ eventarr: this.eventArr })
    }
    findSpot(duration) {

        this.sliceDay(duration);
        this.startDateForSpot = new Date(this.startDate);
        this.endDate = new Date(this.startDateForSpot);
        this.endDate.setMinutes(this.endDate.getMinutes() + duration);
        // console.log(this.spots[0].start.getTimezoneOffset());
        // console.log(this.eventArr[0].start.getTimezoneOffset());
        this.spots.forEach((spot, indexSpot) => {
            this.eventArr.forEach((event, indexEvent) => {
                if (this.overlaps(spot.start, spot.end, event.start, event.end)) {
                    // console.log(`removing ${this.spots[indexSpot].start}`)
                    this.spots.splice(indexSpot, 1);
                }
            })
            this.startDateForSpot.setMinutes(this.startDateForSpot.getMinutes() + duration);
            this.endDate.setMinutes(this.endDate.getMinutes() + duration);
        })
        return this.spots;

    }
    sliceDay(duration) {
        this.spots = []
        this.initialDate = new Date(this.startDate);
        this.endInitialDate = new Date(this.startDate);
        this.endInitialDate.setMinutes(this.endInitialDate.getMinutes() + duration);
        while (this.endInitialDate.getDate() == this.startDate.getDate()) {
            this.spots.push({ start: new Date(this.initialDate), end: new Date(this.endInitialDate) });
            this.endInitialDate.setMinutes(this.endInitialDate.getMinutes() + duration);
            this.initialDate.setMinutes(this.initialDate.getMinutes() + duration);
        }
    }
    overlaps(s_s, s_e, e_s, e_e) {
        s_s = s_s.toISOString();
        s_e = s_e.toISOString();
        e_e = e_e.toISOString();
        e_s = e_s.toISOString();
        if (s_s < e_s && s_e < e_e) {
            console.log("case 1")
            return false;
        }
        if (s_s == e_s) {
            console.log("case 2")
            return true;
        }
        if (s_s > e_s && s_e <= e_e) {
            console.log("case 3")
            return true;
        }
        if (s_s > e_e) {
            console.log({ s_s, e_e })
            console.log("case 4")
            return false;
        }
        if (s_s < e_s && s_e < e_e) {
            console.log("case 5")
            return true;
        }
        if (s_s < e_s && s_e > e_s) {
            console.log("case 1")
            return true;
        }
        return false;
    }
    convertEventArr() {
        this.eventArr.forEach((startend, index) => {
            this.eventArr[index].start = new Date(startend.start);
            this.eventArr[index].end = new Date(startend.end);
        })
    }

    async freeBusyStatus(date) {
        // console.log({ checkmin: this.check.resource.timeMin })
        // console.log({ checkmax: this.check.resource.timeMax })
        return this.calendar.freebusy.query(this.check).then((response) => {
            this.eventArr = response.data.calendars["c_jkea5jm4ajhefe5ot1ejnsv788@group.calendar.google.com"].busy;
            this.convertEventArr()
            return this;
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