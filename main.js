const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("index");

    console.log('accessing');

    app.get(' https://www.googleapis.com/calendar/v3//calendars/calendarId/events/ismaily@carleton.edu/events', (req, res) => {
        console.log('accessing');
        console.log(req.body);
    })
})
app.post("/", (req, res) => {
    console.log(req.body);
    res.redirect('post-submission');
})
app.get('/post-submission', (req, res) => {
    res.render('postSubmission');
})

app.listen(5500, () => { console.log("listening on port 5500") });