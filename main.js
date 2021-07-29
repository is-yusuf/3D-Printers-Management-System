const { google } = require('googleapis');
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs")
const { cal } = require("./Calender");
app.use(express.static(__dirname + '/views'));
app.use(express.json());
const calendar = new cal();

app.get("/", (req, res) => {
    res.render("index.html");
})

app.post("/check", (req, res) => {

    let date = new Date(req.body.date);
    let duration = req.body.duration;
    // console.log({ calendar.freeBusyStatus() });
    getResults();
    async function getResults() {
        let result = await calendar.freeBusyStatus(date, duration)
        console.log({ result });
    }
    // calendar.freeBusyStatus().then((res) => {
    //     console.log({ res });
    // })

})

app.listen(5500, () => { console.log("listening on port 5500") });