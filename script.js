function generateCities(searchList) {
    $("#list-cities").empty();

    var keys = Object.keys(searchList);
    for (var i = 0; i < keys.length; i++) {
        var cityListEntry = $("<button>");
        cityListEntry.addClass("list-group-item list-group-item-action");

        var splitStr = keys[i].toLowerCase().split(" ");
        for (var j = 0; j < splitStr.length; j++) {
            splitStr[j] =
                splitStr[j].charAt(0).toUpperCase() + splitStr[j].substring(1);
        }
        var titleCasedCity = splitStr.join(" ");
        cityListEntry.text(titleCasedCity);

        $("#list-cities").append(cityListEntry);
    }
}

function generateCityWeather(city, searchList) {
    generateCities(searchList);

    var queryURL =
        "https://api.openweathermap.org/data/2.5/weather?&units=imperial&appid=885e9149105e8901c9809ac018ce8658&q=" +
        city;

    var queryURL2 =
        "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=885e9149105e8901c9809ac018ce8658&q=" +
        city;

    var latitude;

    var longitude;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // Store all recieved data inside of an object called "weather"
        .then(function (weather) {
            // Log the queryURL
            console.log(queryURL);

            // Log resulting object
            console.log(weather);

            var currentMoment = moment();

            var visualMoment = $("<h3>");
            $("#city-name").empty();
            $("#city-name").append(
                visualMoment.text("(" + currentMoment.format("M/D/YYYY") + ")")
            );

            var cityName = $("<h3>").text(weather.name);
            $("#city-name").prepend(cityName);

            var weatherIcon = $("<img>");
            weatherIcon.attr(
                "src",
                "https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"
            );
            $("#present-icon").empty();
            $("#present-icon").append(weatherIcon);

            $("#present-temp").text("Temperature: " + weather.main.temp + " °F");
            $("#present-humidity").text("Humidity: " + weather.main.humidity + "%");
            $("#present-wind").text("Wind Speed: " + weather.wind.speed + " MPH");

            latitude = weather.coord.lat;
            longitude = weather.coord.lon;

            var queryURL3 =
                "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=885e9149105e8901c9809ac018ce8658&q=" +
                "&lat=" +
                latitude +
                "&lon=" +
                longitude;

            $.ajax({
                url: queryURL3,
                method: "GET"
                // Store all of the retrieved data inside of an object called "uvIndex"
            }).then(function (uvIndex) {
                console.log(uvIndex);

                var uvIndexVisual = $("<button>");
                uvIndexVisual.addClass("btn btn-danger");

                $("#present-uv").text("UV Index: ");
                $("#present-uv").append(uvIndexVisual.text(uvIndex[0].value));
                console.log(uvIndex[0].value);

                $.ajax({
                    url: queryURL2,
                    method: "GET"
                    // Store all recieved data inside of an object called "result"
                }).then(function (result) {
                    console.log(queryURL2);

                    console.log(result);
                    // Loop through result list array and display a single result entry/time
                    for (var i = 6; i < result.list.length; i += 8) {

                        var resultDate = $("<h5>");

                        var resultPosition = (i + 2) / 8;

                        console.log("#result-date" + resultPosition);

                        $("#result-date" + resultPosition).empty();
                        $("#result-date" + resultPosition).append(
                            resultDate.text(currentMoment.add(1, "days").format("M/D/YYYY"))
                        );

                        var resultIcon = $("<img>");
                        resultIcon.attr(
                            "src",
                            "https://openweathermap.org/img/w/" +
                            result.list[i].weather[0].icon +
                            ".png"
                        );

                        $("#result-icon" + resultPosition).empty();
                        $("#result-icon" + resultPosition).append(resultIcon);

                        console.log(result.list[i].weather[0].icon);

                        $("#result-temp" + resultPosition).text(
                            "Temp: " + result.list[i].main.temp + " °F"
                        );
                        $("#result-humidity" + resultPosition).text(
                            "Humidity: " + result.list[i].main.humidity + "%"
                        );

                        $(".results").attr(
                            "style",
                            "background-color:dodgerblue; color:white"
                        );
                    }
                });
            });
        });
}

$(document).ready(function () {
    var searchListStringified = localStorage.getItem("searchList");

    var searchList = JSON.parse(searchListStringified);

    if (searchList == null) {
        searchList = {};
    }

    generateCities(searchList);

    $("#present-weather").hide();
    $("#result-weather").hide();



    $("#search-button").on("click", function (event) {
        event.preventDefault();
        var city = $("#city-input")
            .val()
            .trim()
            .toLowerCase();

        if (city != "") {


            searchList[city] = true;
            localStorage.setItem("searchList", JSON.stringify(searchList));

            generateCityWeather(city, searchList);

            $("#present-weather").show();
            $("#result-weather").show();
        }


    });

    $("#list-cities").on("click", "button", function (event) {
        event.preventDefault();
        var city = $(this).text();

        generateCityWeather(city, searchList);

        $("#present-weather").show();
        $("#result-weather").show();
    });
});