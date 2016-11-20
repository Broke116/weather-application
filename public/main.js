$(function() {
    var $h1 = $("#title");
    var $zip = $("input[name='zip']");
    var $state = $("input[name='state']");
    var $city = $("input[name='city']");
    $("#zipform").on("submit", function(event) {
        document.getElementById('weatherResult').innerHTML = "";
        event.preventDefault();
        
        var zipCode = $.trim($zip.val());        
        $h1.text("Loading...");

        var request = $.ajax({
            url: "/" + zipCode,
            dataType: "json"
        });

        request.done(function(data) {
            var result = document.getElementById('weatherResult');
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    result.innerHTML += '<ul><li><span>' 
                                    + key + "</span>: " + data[key] + 
                                '</li></ul>';
                }
            }            

            var temperature = data.temperature;
            $h1.html("It is " + temperature + "&#176; in " + zipCode + ".");
        });
        
        request.fail(function() {
            $h1.text("Error!");
        });
    });
    $("#stateform").on("submit", function(event) {
        document.getElementById('weatherResult').innerHTML = "";
        event.preventDefault();
        
        var stateCode = $.trim($state.val());  
        var city = $.trim($city.val());       
        $h1.text("Loading...");

        var request = $.ajax({
            url: "/" + stateCode,
            data: {
                "city": city
            },
            dataType: "json"
        });

        request.done(function(data) {
            var result = document.getElementById('weatherResult');
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    result.innerHTML += '<ul><li><span>' 
                                    + key + "</span>: " + data[key] + 
                                '</li></ul>';
                }
            }            

            var temperature = data.temperature;
            $h1.html("It is " + temperature + "&#176; in " + zipCode + ".");
        });
        
        request.fail(function() {
            $h1.text("Error!");
        });
    });
});