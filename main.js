const express = require ('express');
const app = express();
app.use(express.urlencoded({extended : true}));
app.set("view engine", "ejs")

app.get("/" ,(req,res)=>{
    res.render("index");
})
app.post("/", (req,res)=>{
    console.log(req.body);
    res.redirect('post-submission');   
}) 
app.get('/post-submission', (req,res)=>{
    res.render('postSubmission');
})

app.listen(5500,()=>{console.log("listening on port 5500")});