const { google } = require('googleapis');
const { cal } = require("./Calender");
const { fetchUser } = require("./OctoPrint.js")
const { sendMail } = require('./emailer')
const { OctoPrint } = require('./OctoPrint')
const confirmation = require("./confirmation.json")
const express = require('express');
var session = require('express-session')
const multer = require('multer')
const app = express();
let myCalendar = new cal();
let Octo = new OctoPrint();
const upload = multer({ dest: "Gcodes/" });

/**Used for encoding parameters in the link sent to the users and admins to condirm print */
app.use(express.urlencoded({ extended: false }));
/**Used for digesting json responses from APIs */
app.use(express.json());
/**The root directory to serve static content from */
app.use(express.static(__dirname + '/views'));

const { saveFile, createEntry } = require('./fileOperations');

/**
 * Still under development
 */
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: true } }))

/**For debugging wrong file parsing in files sent to /upload */
app.use((error, req, res, next) => { console.log('This is the rejected field ->', error.field); });


/**
 * Renders the index page of the website.
 */
app.get("/", (req, res) => {
    res.render("index.html");
})

/**
 * Connects to the Calendar to check if exact date is available or not.
 */
app.post("/checkexactdate", (req, res) => {
    let start = new Date(req.body.start)
    let end = new Date(req.body.end)
    res.send(myCalendar.checkExactDate(start, end));
})

app.post("/asap", (req, res) => {
    console.log("________________________________________________________")
    let date = new Date(req.body.date);
    let calID = req.body.calID;
    //adding 5 hours to match time offset + 9 hours to start the day at 9:00 am
    date.setHours(date.getHours() + 14);
    myCalendar.authorize(calID);
    myCalendar.freeBusyStatus(date).then((ReadyCal) => {
        myCalendar = ReadyCal;
        let CalendarResponse = ReadyCal.findFirstSpot(req.body.duration * 60)
        if (!CalendarResponse) {
            res.send(false);
        }
        else {
            res.send(CalendarResponse)
        }
    })
})

/**
 * Schedules an event. The request.body should contain an object which has start and end properties being start and end of event.
 */
app.post("/schedule", (req, res) => {
    if (myCalendar.checkExactDate(new Date(req.body.start), new Date(req.body.end))) {
        myCalendar.schedule(req.body.start, req.body.end);
    }
})

app.get("/userConfirm", (req, res) => {
    let event = req.query.event;
    createEntry("./confirmation.json", event, "user")
    res.send("Thanks for confirming!")
})
app.get("/adminconfirm", (req, res) => {
    let event = req.query.event;
    createEntry("./confirmation.json", event, "admin")
    res.send("Thanks for confirming!")
})

/**
 * Saves a file to /Gcodes and uploads it to local/2Print in the OctoPrint server. request.body should be a FormData object with
 *  fields
 *  file: being the file captured from input field file
 * filename: the file name to be saves as without .gcode
 * milliseconds: the number of milliseconds to send the confirmation email to the user
 */
app.post("/upload", upload.single('file'), (req, res) => {
    // console.log("sending after" + req.body.milliseconds / 60000 + "minute")
    formdata = { ...req.body }
    res.status(saveFile(req.file, formdata.filename + ".gcode").status)
    Octo.uploadFile(formdata.filename, false)
    // sendMail(formdata.email, formdata.name, formdata.content, formdata.milliseconds);
})


app.listen(5500, () => { console.log("listening on port 5500") });














