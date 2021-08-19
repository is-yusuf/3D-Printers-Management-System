const { google } = require('googleapis');
const credentials = require("./credentials-cal.json")
class cal {
    constructor() {

    }
    /**
     * Authorizes and creates the auth object.
     */
    authorize(calID) {
        this.scopes = 'https://www.googleapis.com/auth/calendar';
        this.privateKey = credentials.private_key;
        this.clientEmail = credentials.client_email;
        this.spots = []
        this.calendarId = calID;
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

    }
    /**
     * Sets the general date of Calendar and generates request object.
     * @param {date} date date object to set the day of the Calendar. 
     */
    setDates(date) {
        this.generalDate = new Date(date);
        this.endDay = new Date(date)
        this.endDay.setMinutes(this.endDay.getMinutes() + 60 * 16 - 1);
        this.check = {
            auth: this.auth,
            resource: {
                timeMin: this.generalDate,
                timeMax: this.endDay,
                timeZone: "America/Chicago",
                items: [{ id: this.calendarId }]
            }
        }
    }
    /**
     * Loops over the day by 30 minutes steps to find the first slot.
     * @param {Number} durationMinutes The duration of the event to find the first slot for. 
     * @returns {date,date} the start and end dates of the event.
     */
    findFirstSpot(durationMinutes) {
        this.slotstart = new Date(this.generalDate);
        this.slotend = new Date(this.generalDate);
        this.slotend.setMinutes(this.slotend.getMinutes() + durationMinutes);
        while (!this.checkExactDate(this.slotstart, this.slotend)) {
            this.slotstart.setMinutes(this.slotstart.getMinutes() + 30);
            this.slotend.setMinutes(this.slotend.getMinutes() + 30);
            if (this.slotstart.getHours() >= 20) {
                return false;
            }
        }
        return { start: this.slotstart, end: this.slotend }
    }
    /**
     * 
     * @param {date} s_s Slot Start 
     * @param {date} s_e Slot End
     * @param {date} e_s Event Start
     * @param {date} e_e Event End
     * @returns {boolean} true if the event and slot overlaps, false otherwise.
     */
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
    /**
     * convers the array of events (originally of strings) to an array of dates.
     */
    convertEventArr() {
        this.eventArr.map((event) => {
            event.start = new Date(event.start);
            event.end = new Date(event.end);
        })
    }
    /**
     * 
     * @param {date} date the date from which to grab the events. 
     * @returns {calendar} the ready calendar object with attributes set.
     */
    async freeBusyStatus(date) {
        this.setDates(date);
        return this.calendar.freebusy.query(this.check).then((response) => {
            this.eventArr = response.data.calendars[this.calendarId].busy;
            this.convertEventArr()
            return this;
        })
    }
    /**
     * Schedules and event in a specefic time slot.
     * @param {Date} startDate the start date of the event to schedule  
     * @param {Date} endDate the end date of the event to schedule
     */
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
    /**
     * checks if a slot is empty or not
     * @param {Date} startDate the start date of the slot to check 
     * @param {Date} endDate the end date of the slot to check
     * @returns {boolean} true if empty, false if used.
     */
    checkExactDate(startDate, endDate) {
        if (startDate.getHours() > 20) {
            return false;
        }
        return !(this.eventArr.some(event => this.overlaps(startDate, endDate, event.start, event.end)))
    }
    /**
     * Prints the start and end hours and minutes to the terminal in human friendly way without the date.
     * @param {Date} startdate the start of the date 
     * @param {Date} enddate the end of the date
     */
    printTime(startdate, enddate) {
        console.log({ start: `${startdate.getHours()} : ${startdate.getMinutes()}` })
        console.log({ end: `${enddate.getHours()} : ${enddate.getMinutes()}` })

    }
    /**
     * Prints the events in that day.
     */
    printEvents() {
        console.log({ eventarr: this.eventArr })
    }
}

exports.cal = cal;