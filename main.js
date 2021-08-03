// importing googleapis for the calendar
const { google } = require('googleapis');
const { cal } = require("./Calender");
let myCalendar = new cal();

// importing express for the server side
const express = require('express');
const { Console } = require('console');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs")
// this is becasue express doesn't know how to read request of json
app.use(express.json());
// in order for express to know the directory of front end
app.use(express.static(__dirname + '/views'));


// rendering the homepage
app.get("/", (req, res) => {
    res.render("index.html");
})

// requests sent to /check are being used to check the vacant places in the date provided
app.post("/check", (req, res) => {
    // console.log("________________________________________________________")
    let date = new Date(req.body.date);
    // console.log(date)
    // adding 8 becasue we want to start the day at 8am
    date.setHours(date.getHours() + 8);
    // console.log({ date })
    let duration = req.body.duration;
    // creates a caldenar instant
    myCalendar.freeBusyStatus(date).then((ReadyCal) => {
        // ReadyCal.findSpot(30)
        myCalendar = ReadyCal
        res.send({ availableslots: myCalendar.findSpot(30) })

    })
})
app.post("/asap", (req, res) => {
    console.log("________________________________________________________")
    let date = new Date(req.body.date);
    date.setHours(date.getHours() + 14);
    myCalendar.freeBusyStatus(date).then((ReadyCal) => {
        res.send(ReadyCal.findFirstSpot(req.body.duration * 60))
        console.log(ReadyCal.findFirstSpot(req.body.duration * 60))
    })

})

app.post("/schedule", (req, res) => {
    myCalendar.schedule(req.body.start, req.body.end);
    // console.log("scheduled");
})
app.listen(5500, () => { console.log("listening on port 5500") });

