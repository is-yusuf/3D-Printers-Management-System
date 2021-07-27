const { json } = require('body-parser');
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs")
const { cal } = require("./Calender");
app.use(express.static(__dirname + '/views'));
app.use(express.json());



const com = require("./views/com.json");
const calender = new cal();

app.get("/", (req, res) => {
    res.render("index.html");
})
app.post("/checking", (req, res) => {
    console.log(req.body);
    res.json({ dataToSend: 'stuf' })
})

app.post("/check", (req, res) => {
    console.log(req.body);
    res.send({ test: "test" })
})

app.listen(5500, () => { console.log("listening on port 5500") });