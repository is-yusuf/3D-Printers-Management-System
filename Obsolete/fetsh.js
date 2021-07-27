const fetch = require("node-fetch");
fetch(`path`).then(res => {
    return res.json()
})
    .then((data) => {
        console.log(data + `ss`);
    })


    // fetch("https://www.googleapis.com/calendar/v3/calendars/c_jkea5jm4ajhefe5ot1ejnsv788@group.calendar.google.com/events?key=AIzaSyAneZJORlDZ70JVvWr_RWu8CBIZYp-rJnM", {

    // })
    //     .then(res => {
    //         return res.json()
    //     })
    //     .then((data) => {
    //         console.log(data);
    //     })