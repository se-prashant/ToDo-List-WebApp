const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

var _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// mongoose.connect("mongodb://localhost:27017/todoListDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false
// });
mongoose.connect("mongodb+srv://prashant-recs:abcdefij@cluster0.pjgbg.mongodb.net/todoListDB",{
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useFindAndModify:false
});

const itemsSchema = mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todoList :)"
});


const item2 = new Item({
  name: "Hit the + button to add a new task"
});

const item3 = new Item({
  name: "click on checkbox <-- to delete an item."
});
const defaultItems = [item1, item2,item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {
  Item.find({}, function(err, todoItems) {
    if (todoItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          // console.log("successfull", defaultItems);
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Today",
        newTask: todoItems
      });
    }
  });
});

app.get("/:customlistName", function(req, res) {
  const customlistName = _.capitalize(req.params.customlistName);
  // console.log(customlistName);
  List.findOne({
    name: customlistName
  }, function(err, foundList) {

    if (err) {
      console.log(err);
    } else {
      if (foundList) {
        //Show an existing list

        res.render("list", {
          listTitle: foundList.name,
          newTask: foundList.items
        });
      } else {
        // Create a new listT
        const list = new List({
          name: customlistName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customlistName);
      }
    }
  });



})

app.get("/about", function(req, res) {
  res.render("about");
})

app.post("/delete", function(req, res) {
  const item_id = req.body.checkbox;
  const listName = req.body.listName;
  // console.log(item_id," ",listName);
  if (listName == "Today") {
    Item.findByIdAndRemove(item_id, function(err) {
      if (!err) {
        console.log("Successfully Deleted");
        res.redirect("/");
      }
    });
  }else{
    List.findOneAndUpdate({name:listName},
      {$pull:{items:{_id:item_id}}},
      function(err,foundList){
      if(!err){
        res.redirect("/"+listName);
      }
    });
  }
})

app.post("/", function(req, res) {
  const listName = req.body.title;
  const taskName = req.body.newTask;
  const newTask = new Item({
    name: req.body.newTask
  });
  if (listName == "Today") {
    newTask.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      if (err) {
        console.log(err);
      } else {
        const task = {
          name: taskName
        };
        foundList.items.push(task);
        foundList.save();
        res.redirect("/" + listName);
      }
    });
  }

});

let port = process.env.PORT;
if(port==null || port==""){
  port = 3000;
}
app.listen(port, function() {
  console.log("server started successfull");
})
