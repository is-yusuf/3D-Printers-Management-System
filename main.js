const { google } = require('googleapis');
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs")
const { cal } = require("./Calender");
const { dataflow } = require('googleapis/build/src/apis/dataflow');
const { Console } = require('console');
app.use(express.static(__dirname + '/views'));
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index.html");
})

app.post("/check", (req, res) => {
    console.log("________________________________________________________")
    let date = new Date(req.body.date);
    date.setHours(8);
    let duration = req.body.duration;
    const myCalendar = new cal(date);
    setTimeout(() => {
        myCalendar.printEvents();
    }, 3000);

    // let result = findSpot(date, duration)
    // console.log({ result })
    // if (result.exists) {
    //     res.send({ message: `Successful, we found a spot at ${result.date}` });
    // }
})

function findSpot(date, duration) {
    console.log(myCalendar.freeBusyStatus(date, duration));
    // myCalendar.freeBusyStatus(date, duration).then((resfromcal) => {
    //     console.log({ resfromcal });
    // })
    return {
        exists: true,
        date, date
    }

    // .then((resultFromCalender) => {
    //     console.log({ resultFromCalender })

    //     return {
    //         exists: true,
    //         date: date
    //     }
    //     if (resultFromCalender.exists) {
    //         return {
    //             exists: true,
    //             date: date
    //         }
    //     }
    // else if (date.getHours() < 17) {
    //     date.setMinutes(date.getMinutes() + duration)
    //     return findSpot(date, duration)
    // }
    // else {
    //     return {
    //         exists: false,
    //         date: null
    //     }
    // }
    // })
}

app.listen(5500, () => { console.log("listening on port 5500") });