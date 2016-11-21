var path = require("path");
var express = require("express");
var morgan = require("morgan");
var router = express.Router();
var port = process.env.PORT || 3000;

var app = express();

// routes
var index = require('./routes/index');
// view engine
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use(morgan("dev"));
app.use(express.static(path.resolve(__dirname, "public")));
app.use('/', index);

app.use(function(err, req, res, next){    
    if(res.statusCode = 500) {res.status(500).render("500"); console.log(err.stack);}
    else if(res.statusCode = 404) {res.status(404).render("404");}
    else if(res.statusCode = 400) {res.status(400).send('Bad Request');}
});

app.listen(port, function(){ console.log("Server is running at localhost:3000"); })