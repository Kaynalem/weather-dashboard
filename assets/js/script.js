const APIKey = "71f0affdf4c99a202cf0423a9baf6d29";

$(document).ready(function () {
    // when search button is clicked
    $("#searchBtn").on("click", function () {
        const searchTerm = $("#searchCity").val().trim();
        $("#searchCity").val("");
        weatherCurrent(searchTerm);// current weather for city
        weatherFuture(searchTerm);// 5-day forecast for city
    });
    // when enter button pressed
    $("#searchCity").on('keyup', function (e) {
        const searchTerm = $("#searchCity").val().trim();
        if (e.keyCode === 13) {
            weatherCurrent(searchTerm);// current weather for city
            weatherFuture(searchTerm);// 5-day forecast for city
        }
    });
});    
var searchHistory = JSON.parse(localStorage.getItem("history")) || []; // gets any search history from local storage

if (searchHistory.length > 0) {
    weatherCurrent(searchHistory[searchHistory.length -1]);
}
for (var i = 0; i < searchHistory.length; i++) {// display each city stored in local storage
    showHistory(searchHistory[i]);
}

function showHistory(text) {
    var searchCity = $("<li>").addClass("list-group-item").text(text);
    $("#searchHistory").append(searchCity);
}
// display weather when user clicks on city form search history list
$("#searchHistory").on("click", "li", function () {
    weatherCurrent($(this).text());
    weatherFuture($(this).text());
});

function weatherCurrent(searchTerm) {
    fetch('http://api.openweathermap.org/data/2.5/weather?q=' + searchTerm + '&appid=' + APIKey + '&units=imperial')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        if (searchHistory.indexOf(searchTerm) === -1) {// if index of searched City does not exist in local storage
            searchHistory.push(searchTerm);
            localStorage.setItem("history", JSON.stringify(searchHistory));// places item pushed into local storage with
            showHistory(searchTerm);
        }
        $("#weatherCurrent").empty();
        var city = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        var icon =  $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
        var card = $("<div>").addClass("card");
        var cardBody = $("<div>").addClass("card-body");
        var temp = $("<p>").addClass("card-text").text("Temperature: " + Math.floor(data.main.temp) + " °F");
        var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        
        var cityLon = data.coord.lon;
        var cityLat = data.coord.lat;

        fetch('http://api.openweathermap.org/data/2.5/uvi?appid=' + APIKey + '&lat=' + cityLat + '&lon=' + cityLon)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            var uvValue = data.value;
            var uvIndex = $("<p>").addClass("card-text").text("UV Index: ");
            var btn = $("<span>").addClass("btn btn-sm").text(uvValue);

            if (uvValue < 3) {
                btn.addClass("btn-success")
            } else if (uvValue < 7) {
                btn.addClass("btn-warning");
            } else {
                btn.addClass("btn-danger");
            }

        cardBody.append(uvIndex);
        $("#weatherCurrent .card-body").append(uvIndex.append(btn));
    });
        city.append(icon);
        cardBody.append(city, temp, humidity, wind);
        card.append(cardBody);
        $("#weatherCurrent").append(card);
    });

}