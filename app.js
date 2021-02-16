const express = require("express");

const bodyParser = require("body-parser");

// requiring mongoose for database
const mongoose = require("mongoose");

const _ = require("lodash");


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
    name: String
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

// schema for customList
const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

let day;

app.get("/", (req, res) => {

    var today = new Date();

    var options = {
        weekday: "long",

        day: "numeric",
        month: "long"
    };

    day = today.toLocaleDateString("en-US", options);

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

    let listName = req.body.btn

    const newItem = new Item({
        name: item
    });

    if (listName === day) {
        newItem.save();
        res.redirect("/");
    }
    else {
        List.findOne({ name: listName }, (err, foundList) => {
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/" + listName);
        });
    }



});


app.post("/delete", (req, res) => {
    const toDeleteId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === day) {
        Item.findByIdAndRemove(toDeleteId, (err) => {
            if (!err) {
                console.log("Successfully Deleted check item!");
                res.redirect("/");
            }
        })
    }
    else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: toDeleteId } } }, (err, foundList) => {
            if (!err) {
                res.redirect("/" + listName);
            }
        })
    }


});

// Express routing paramters (dynamic URL)
app.get("/:variable1", (req, res) => {
    const customeListName = _.capitalize(req.params.variable1);

    List.findOne({ name: customeListName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customeListName,
                    items: defaultItems
                });
                list.save((err, result) => {
                    res.redirect("/" + customeListName);
                });

            }
            else {
                res.render("list", { listTitle: customeListName, listItems: foundList.items });
            }
        }
    })



});


app.listen(3000, () => {
    console.log("server is up and running on port 4000");
});