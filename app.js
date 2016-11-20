var path = require("path");
var express = require("express");
var morgan = require("morgan");
var zipdb = require("zippity-do-dah");
var ForecastIo = require("forecastio");
var app = express();

var error = [];
var weatherData = {};
app.locals.error = error;

var weather = new ForecastIo("c56fea1eb4c8abf4a602f8769f446d67");

app.use(morgan("dev"));

app.use(express.static(path.resolve(__dirname, "public")));

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("index");
});

app.get(/^\/(\d{5})$/, function(req, res, next){ // captures the specified zip code
    var zipcode = req.params[0];
    var location = zipdb.zipcode(zipcode); // grab location data with the zip code from zippity
    if(!location.zipcode){ // return when no results are found.
        next();
        return;
    }

    var latitude = location.latitude;
    var longitude = location.longitude;

    weather.forecast(latitude, longitude, function(err, data){ // get weather with lat long parameters
        if(err) { next(); return; }
        res.json({ // send json object with express json method for response
            zipcode: zipcode,
            timezone: data.timezone,
            summary: data.currently.summary,
            windSpeed: data.currently.windSpeed,
            temperature: data.currently.temperature,
            humidity: data.currently.humidity,
            dailySummary: data.daily.summary
        });        
    });
});

app.get(/^\/(\w+)/, function(req, res, next){
    var state = req.params[0];
    var city = req.query.city;
    var location = zipdb.citystate(city, state);

    console.log(location);
    
    var latitude = location.latitude;
    var longitude = location.longitude;

    console.log("lat:" , latitude, " long: ", longitude);

    weather.forecast(latitude, longitude, function(err, data){ // get weather with lat long parameters
        if(err) { console.log(err.stack); next(); return; }
        console.log("weather data: ", data);
        res.json({ // send json object with express json method for response
            zipcode: data.zipcode,
            timezone: data.timezone,
            summary: data.currently.summary,
            windSpeed: data.currently.windSpeed,
            temperature: data.currently.temperature,
            humidity: data.currently.humidity,
            dailySummary: data.daily.summary
        });        
    });
});

app.use(function(err, req, res, next){    
    if(res.statusCode = 500) {res.status(500).render("500"); console.log(err.stack);}
    else if(res.statusCode = 404) {res.status(404).render("404");}
    else if(res.statusCode = 400) {res.status(400).send('Bad Request');}
});

app.listen(3000, function(){ console.log("Server is running at localhost:3000"); })