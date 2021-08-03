const { Console } = require('console');
const { response } = require('express');
const { google } = require('googleapis');
const credentials = require("./views/assets/credentials-cal.json")
var EventEmitter = require('events').EventEmitter;
var util = require('util');
class cal {
    constructor() {

    }
    authorize(date) {
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

    printEvents() {
        console.log({ eventarr: this.eventArr })
    }
    findSpot(duration) {
        this.sliceDay(duration);
        // console.log({ spots: this.spots })
        this.updatedslots = []
        if (this.eventArr.length == 0) {
            this.updatedslots = Object.assign(this.spots)
        }
        let nonoverlapwith = 0;
        this.spots.forEach((spot) => {
            this.eventArr.forEach((event) => {
                if (!this.overlaps(spot.start, spot.end, event.start, event.end)) {
                    // console.log(spot.start + "  is added")
                    // this.updatedslots.push(spot);
                    nonoverlapwith += 1;
                }
            })
            if (nonoverlapwith == this.eventArr.length) {
                this.updatedslots.push(spot);
            }
            nonoverlapwith = 0;
        })
        return this.updatedslots;
    }

    findFirstSpot(durationMinutes) {
        this.slotstart = new Date(this.generalDate);
        this.slotend = new Date(this.generalDate);
        this.slotend.setMinutes(this.slotend.getMinutes() + durationMinutes);
        if (this.eventArr.length == 0) {
            return { start: this.slotstart, end: this.slotend }
        }
        let Justbreak = false;
        while (!Justbreak) {
            let NonOverlap = 0;
            this.eventArr.forEach((event) => {
                if (!this.overlaps(this.slotstart, this.slotend, event.start, event.end)) {
                    NonOverlap += 1;
                }
            })
            if (NonOverlap == this.eventArr.length) {
                this.printEvents()
                console.log(
                    { start: this.slotstart, end: this.slotend }
                )
                Justbreak = true
            }
            else {
                NonOverlap = 0;
                if (!(this.slotstart.getHours() >= 20)) {
                    this.slotstart.setMinutes(this.slotstart.getMinutes() + 30);
                    this.slotend.setMinutes(this.slotend.getMinutes() + 30);
                }
                else {
                    this.slotstart = new Date(this.generalDate);
                    this.slotend = new Date(this.generalDate);
                    this.slotend.setMinutes(this.slotend.getMinutes() + durationMinutes);
                    this.slotstart.setDate(this.slotstart.getDate() + 1)
                    this.slotend.setDate(this.slotend.getDate() + 1)
                }
            }

        }
        return { start: this.slotstart, end: this.slotend }
    }
    sliceDay(duration) {
        this.spots = []
        this.initialDate = new Date(this.startDate);
        this.endInitialDate = new Date(this.startDate);
        this.endInitialDate.setMinutes(this.endInitialDate.getMinutes() + duration);
        // console.log({ initdate: this.endInitialDate, startdate: this.startDate })

        while (this.endInitialDate.getDate() == this.startDate.getDate() && this.endInitialDate.getHours() != 0) {
            this.spots.push({ start: new Date(this.initialDate), end: new Date(this.endInitialDate) });
            this.endInitialDate.setMinutes(this.endInitialDate.getMinutes() + duration);
            this.initialDate.setMinutes(this.initialDate.getMinutes() + duration);
        }
    }
    printSlots() {
        console.log({ slots: this.spots })
    }
    overlaps(s_s, s_e, e_s, e_e) {
        s_s = s_s.getTime()
        s_e = s_e.getTime()
        e_s = e_s.getTime()
        e_e = e_e.getTime()

        if (e_s - s_s >= s_s - s_e && s_e > e_s) {
            return true
        }
        else {
            return false
        }

        if (s_s < e_s && s_e < e_s) {
            // console.log("case 1")
            return false;
        }
        if (s_s == e_s) {
            // console.log("case 2")
            return true;
        }
        if (s_s > e_s && s_e <= e_e) {
            // console.log("case 3")
            return true;
        }
        if (s_s > e_e) {
            // console.log("case 4")
            return false;
        }
        if (s_s < e_s && s_e < e_e) {
            // console.log("case 5")
            return true;
        }
        if (s_s < e_s && s_e > e_s) {
            // console.log("case 6")
            return true;
        }

        return false;
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
        this.generalDate = date;
        this.authorize(date);
        return this.calendar.freebusy.query(this.check).then((response) => {
            this.eventArr = response.data.calendars["c_jkea5jm4ajhefe5ot1ejnsv788@group.calendar.google.com"].busy;
            // console.log({ eventarroriginalaa: this.eventArr })

            this.convertEventArr()
            // console.log({ eventarroriginal: this.eventArr })
            return this;
        })

    }
    schedule(startDate, endDate) {
        // console.log(this)
        // console.log(this.calendarId)

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
        // console.log(this.calendarId, this.event)
        this.calendar.events.insert(
            { calendarId: this.calendarId, resource: this.event },
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