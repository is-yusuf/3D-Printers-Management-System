const { google } = require('googleapis');
const { cal } = require("./Calender");
const express = require('express');
const { Console } = require('console');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs")
app.use(express.json());
app.use(express.static(__dirname + '/views'));
let myCalendar = new cal();
var session = require('express-session')
const { fetchUser } = require("./OctoPrint.js")
const fetch = require('node-fetch');
const { sendMail } = require('./emailer')
const multer = require('multer')

const { saveFile } = require('./fileOperations')


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

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

app.post("/schedule", (req, res) => {
    if (myCalendar.checkExactDate(new Date(req.body.start), new Date(req.body.end))) {
        myCalendar.schedule(req.body.start, req.body.end);
    }
})
app.post("/apicheck", (req, res) => {
    console.log(req.rawHeaders)
    res.send("helloworld")
})

const upload = multer({
    dest: "/Gcodes"
});

app.post("/upload", upload.single('File'), (req, res) => {
    // console.log(saveFile(req.file));
    res.status(saveFile(req.file).status)
        .contentType(saveFile(req.file).contentType)
        .end(saveFile(req.file).end)
})


app.listen(5500, () => { console.log("listening on port 5500") });















