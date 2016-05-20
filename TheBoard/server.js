var http = require('http');
var express = require('express');
var app = express();
var flash = require('connect-flash');
// Setting the ViewEngine
app.set("view engine", "vash");

// Opt into services
app.use(require('body-parser').urlencoded());  //Handle form encoded data
app.use(require('body-parser').json());   // Handle json serialized body content. requires: >npm install body-parser --save
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: "SecretString" }));
app.use(flash());


var controllers = require('./controllers');


// Allow static resources to be downloaded (expressCommand)
// (public static resources)
app.use(express.static(__dirname + "/public"));

// Use Authentication
var auth = require('./auth');
auth.init(app);

// Map the routes
controllers.init(app);


//  EJS Example
//var ejsEng = require('ejs-locals');
//app.engine("ejs", ejsEng);  // To support the master pages
//app.set("view engine", "ejs");  // EJS view engine

//app.get("/", function(req, res) {
//    res.render("ejs/index",
//        { title: "Express + EJS" });
//});

//  Jade View example
//app.set("view engine", "jade");

//app.get("/", function(req, res) {
//    //res.send("<html><body>Hello</body></html");
//    res.render("jade/index",
//        { title: "Express + Jade" });
//});


//app.get("/api/sql", function (req, res) {
//    var mssql = require("node-sqlserver-unofficial");
//    var connStr = "Server=172.18.90.28;Database=Guy-NG1;User Id=sa;Password =;";
//    var query = "SELECT * FROM Customers";

//    mssql.query(connStr, query, function (err, results) {
//        // No Error Handling (ToDo)
//        res.send(results);
//    });
//});

app.get("/api/users", function (req, res) {
    res.set("Content-Type", "application/json");
    res.send({name: "Guy", isValid: "true"});
});

 var port = 3000;
 var server = http.createServer(app);
 server.listen(port);

 var updater = require('./updater');
updater.init(server);