class cal {
    constructor() {
        const { google } = import("googleapis");
        const { OAuth2 } = import("google.auth");

        const credentials = import("./assets/Credentials.json");


        const oAuth2Client = new OAuth2(
            credentials.clientID,
            credentials.clientSecret
        )
        oAuth2Client.setCredentials({
            refresh_token: '1//04YA_tHCNgrwfCgYIARAAGAQSNwF-L9IrWYRtinxD0fWUEYIcsq1zdX9VoYXk3fOcqBsMlPAqxpxfDEsBj3kpjN7GYd6M93yApRU',
        })
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

        // const eventStartTime = new Date()
        // const eventEndTime = new Date()
        // eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)

        const event = {
            summary: `Scheduled print`,
            location: `Makerspace`,
            description: `description.`,
            colorId: 1,
            start: {
                dateTime: null,
                timeZone: 'America/Chicago',
            },
            end: {
                dateTime: null,
                timeZone: 'America/Chicago',
            },
        }

    }

    check(startDate, duration) {
        let eventStartTime = startDate;
        let eventEndTime = eventStartTime.setMinutes(eventStartTime.getMinutes() + duration);

        calendar.freebusy.query(
            {
                resource: {
                    timeMin: eventStartTime,
                    timeMax: eventEndTime,
                    timeZone: 'America/Minneapolis',
                    items: [{ id: 'primary' }],
                },
            },
            (err, res) => {
                // Check for errors in our query and log them if they exist.
                if (err) return console.error('Free Busy Query Error: ', err)

                // Create an array of all events on our calendar during that time.
                const eventArr = res.data.calendars.primary.busy

                // Check if event array is empty which means we are not busy
                if (eventArr.length === 0)
                    // If we are not busy create a new calendar event.
                    return true
                // If event array is not empty log that we are busy.
                console.log(`Sorry I'm busy...`);
                return false;
            }
        )
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

export { cal };
// exports.cal = cal;