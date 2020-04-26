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
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + searchTerm + '&appid=' + APIKey + '&units=imperial')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        if (searchHistory.indexOf(searchTerm) === -1) {// if index of searched City does not exist in local storage, add city to local storage list
            searchHistory.push(searchTerm);
            localStorage.setItem("history", JSON.stringify(searchHistory));// places item pushed into local storage
            showHistory(searchTerm);
        }
        $("#weatherCurrent").empty();
        var city = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        var icon =  $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
        var card = $("<div>").addClass("card");
        var cardBody = $("<div>").addClass("card-body");
        var temp = $("<p>").addClass("card-text").text("Temperature: " + Math.round(data.main.temp) + " °F");
        var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        
        var cityLon = data.coord.lon;
        var cityLat = data.coord.lat;

        fetch('https://api.openweathermap.org/data/2.5/uvi?appid=' + APIKey + '&lat=' + cityLat + '&lon=' + cityLon)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            var uvValue = data.value;
            var uvIndex = $("<p>").addClass("card-text").text("UV Index: ");
            var uvColor = $("<span>").addClass("p-2 mb-2 rounded").text(uvValue);

            if (uvValue < 3) {
                uvColor.addClass("bg-success")
            } else if (uvValue < 7) {
                uvColor.addClass("bg-warning");
            } else {
                uvColor.addClass("bg-danger");
            }
        // add values to card for current city weather
        cardBody.append(uvIndex);
        $("#weatherCurrent .card-body").append(uvIndex.append(uvColor));
    });
        city.append(icon);
        cardBody.append(city, temp, humidity, wind);
        card.append(cardBody);
        $("#weatherCurrent").append(card);
    });
}
//5 day forecast
function weatherFuture(searchTerm) {
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + searchTerm + '&appid=' + APIKey + '&units=imperial')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);
            $("#weatherTitle").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
            $("#weatherForecast").empty();
            for (var i = 5; i < data.list.length; i+=8) {
            //for (var i = 1; i < data.list.length; i++) {
                //if (data.list[i].dt_txt.indexOf("12:00:00") !== -1) {

                    var dateFive = $("<h4>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                    var iconFive = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                    var contFive = $("<div>").addClass("col-md-2");
                    var cardFive = $("<div>").addClass("card bg-primary text-white");
                    var cardBodyFive = $("<div>").addClass("card-body p-2");
                    var tempFive = $("<p>").addClass("card-text").text("Temperature: " + Math.round(data.list[i].main.temp) + " °F");
                    var humidityFive = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                    

                    //merge together and put on page
                    contFive.append(cardFive.append(cardBodyFive.append(dateFive, iconFive, tempFive, humidityFive)));
                    //append card to column, body to card, and other elements to body
                    $("#weatherForecast").append(contFive);
               // }
        }
        
    });

}
