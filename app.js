
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname +"/date.js");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const tasks = [];
const workItems = [];

app.get("/",function(req,res){
  let day  = date.getDate();
  res.render("list",{listTitle:day,newTask:tasks});
    // res.send("Work Day");
});

app.get("/work",function(req,res){
  res.render("list",{listTitle:"Work List", newTask:workItems})
})

app.get("/about",function(req,res){
  res.render("about");
})

app.post("/",function(req,res){
  let newTask = req.body.newTask;
  if(req.body.title === "Work List"){
    workItems.push(newTask);
    res.redirect("/work");
  }else{
    tasks.push(newTask)
    res.redirect("/");
  }
  // res.render("list",{task:task});
});

app.listen(3000,function(){
  console.log("server started on port-3000");
})
