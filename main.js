const { google } = require('googleapis');
const { cal } = require("./Calender");
let myCalendar = new cal();
const express = require('express');
const { Console } = require('console');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs")
app.use(express.json());
app.use(express.static(__dirname + '/views'));
app.get("/", (req, res) => {
    res.render("index.html");
})

app.post("/checkexactdate", (req, res) => {
    res.send(myCalendar.checkExactDate(req.body.start, req.body.end));
})

app.post("/asap", (req, res) => {
    console.log("________________________________________________________")
    let date = new Date(req.body.date);
    date.setHours(date.getHours() + 14);
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
    myCalendar.schedule(req.body.start, req.body.end);
})
app.listen(5500, () => { console.log("listening on port 5500") });