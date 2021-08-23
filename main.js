const { google } = require('googleapis');
const { cal } = require("./Calender");
const { fetchUser } = require("./OctoPrint.js")
const { sendMail } = require('./emailer')
const { OctoPrint } = require('./OctoPrint')
const credentials = require("./credentials-cal.json")
const express = require('express');
var session = require('express-session')
const multer = require('multer')
const app = express();
let myCalendar = new cal();
let Octo = new OctoPrint();
const upload = multer({ dest: "Gcodes/" });
const socket = require("socket.io");

/**Used for encoding parameters in the link sent to the users and admins to condirm print */
app.use(express.urlencoded({ extended: false }));
/**Used for digesting json responses from APIs */
app.use(express.json());
/**The root directory to serve static content from */
app.use(express.static(__dirname + '/views'));

const { saveFile, deleteFile } = require('./fileOperations');

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


app.get("/userconfirm", (req, res) => {
    let id = req.query.id;
    res.send("Thanks for confirming!")
    let arrOfValues = id.split("_");
    io.emit('userConfirmed', {
        paragraph: `Username : ${arrOfValues[0]}
Date : ${new Date(arrOfValues[1])}
Material : ${arrOfValues[2]}
Printer : ${arrOfValues[3]}
duration : ${arrOfValues[4]}
color : ${arrOfValues[5]}`,
        id: id
    })
})

app.post("/adminconfirm", (req, res) => {
    Octo.print(req.body.id)
})

/**
* Saves a file to /Gcodes and uploads it to local/2Print in the OctoPrint server. request.body should be a FormData object with
 *  fields
 *  file: being the file captured from input field file
 * filename: the file name to be saves as without .gcode
 * milliseconds: the number of milliseconds to send the confirmation email to the user
 */
app.post("/upload", upload.single('file'), (req, res) => {
    formdata = { ...req.body }
    res.status(saveFile(req.file, formdata.filename + ".gcode").status)
    Octo.uploadFile(formdata.filename, false)
    setTimeout(() => {
        deleteFile(formdata.filename)
    }, 60000);
    // sendMail(formdata.email,  formdata.content,formdata.name, formdata.milliseconds);
})

app.route('/admin')
    .get((req, res) => {
        res.sendFile(__dirname + "/views/admin.html")
    })
    .delete((req, res) => {
        try {
            // console.log(req.body);
            Octo.deleteFile(req.body.id)
            sendMail(req.body.split("_")[0] + "@carleton.edu", "Your print job has been cancelled by MakerSpace admin.")
            res.status(200)

        }
        catch {
            res.status(500)
        }
    })

app.post('/webhook', (req, res) => {
    console.log(req.body);
    io.emit("updateStatus", {
        printer: req.body.deviceIdentifier,
        file: req.body.extra.name,
        precentage: req.body.progress.completion,
        timeLeft: req.body.progress.printTimeLeft
    })
    res.send("req")
})

app.post('/job', (req, res) => {
    Octo.jobCommand(req.body.printer, req.body.command)
    res.send("Successful")
})

app.post('/jobdone', (req, res) => {
    let email = req.body.job.file.name.split('_')[0];
    sendMail(email, `Your print job using ${req.body.deviceIdentifier} is done`)
    Octo.deleteFile(req.body.file.name)
})

// app.route('/job')
const server = app.listen(5500, () => { console.log("listening on port 5500") });

let io = socket(server);
io.on("connection", (socket) => {
    console.log(`made socket connection to ${socket.id}`);
})


io.use((socket, next) => {
    const password = socket.handshake.auth.password;
    if (password == credentials.password) {
        next()
    }
    else {
        return next(new Error("invalid password"))
    }
});










