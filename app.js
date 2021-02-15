const express = require("express");

const bodyParser = require("body-parser");

// requiring mongoose for database
const mongoose = require("mongoose");


const app = express();

//for using static file like css external file
app.use(express.static("public"));

//for getting the form data throught the html page
app.use(bodyParser.urlencoded({ extended: true }));

//for templating
app.set('view engine', 'ejs');

// connecting to the database
mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

// creating schema
const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    }
})

// creating mongoose model
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist"
});

const item2 = new Item({
    name: "hit the + button to add a new item"
});

const item3 = new Item({
    name: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];





app.get("/", (req, res) => {

    var today = new Date();

    var options = {
        weekday: "long",

        day: "numeric",
        month: "long"
    };

    var day = today.toLocaleDateString("en-US", options);

    Item.find({}, (err, items) => {
        if (items.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log();
                }
                else {
                    console.log("successfully added!");
                }
            });
            res.redirect("/")
        }
        else {
            res.render("list", { listTitle: day, listItems: items });
        }
    });



});

app.post("/", (req, res) => {
    let item = req.body.newItem;

    const newItem = new Item({
        name: item
    });

    newItem.save();
    res.redirect("/");

});


app.post("/delete", (req, res) => {
    const toDelete = req.body.checkbox;

    Item.findByIdAndRemove(toDelete, (err) => {
        if (!err) {
            console.log("Successfully Deleted check item!");
            res.redirect("/");
        }
    })
});


app.listen(3000, () => {
    console.log("server is up and running on port 4000");
});