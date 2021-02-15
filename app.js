const express = require("express");

const bodyParser = require("body-parser");

const app = express();

//for using static file like css external file
app.use(express.static("public"));

//for getting the form data throught the html page
app.use(bodyParser.urlencoded({extended:true}));

//for templating
app.set('view engine','ejs');


var list = ["Buy Food","Cook Food","Eat Food"];
var workList = [];

app.get("/",(req,res)=>{

    var today = new Date();

    var options = {
        weekday: "long",
       
        day: "numeric",
        month: "long"
    };

    var day = today.toLocaleDateString("en-US",options);
    
    res.render("list",{listTitle:day,listItems:list});
    

});

app.post("/",(req,res)=>{
 let item = req.body.newItem;

 if(req.body.btn === "Work List"){
    workList.push(item);
    res.redirect("/work");
 }
else{   
    list.push(item);
    res.redirect("/");
}
    
})


app.get("/work",(req,res)=>{
    res.render("list",{listTitle:"Work List",listItems:workList});
});


app.listen(3000,()=>{
    console.log("server is up and running on port 4000");
});