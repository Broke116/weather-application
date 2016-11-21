var express = require('express');
var zipdb = require("zippity-do-dah");
var ForecastIo = require("forecastio");

var weather = new ForecastIo("c56fea1eb4c8abf4a602f8769f446d67"); // api key for forecastIo

var router = express.Router();

router.get("/", function(req, res){
    res.render("index");
});

router.get(/^\/(\d{5})$/, function(req, res, next){ // captures the specified zip code
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

router.get(/^\/(\w+)/, function(req, res, next){
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

module.exports = router;