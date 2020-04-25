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
    fetch('http://api.openweathermap.org/data/2.5/weather?q=' + searchTerm + '&appid=' + APIKey)
    .then((response) => {
        if (searchHistory.indexOf(searchTerm) === -1) {// if index of searched City does not exist in local storage
            searchHistory.push(searchTerm);
            localStorage.setItem("history", JSON.stringify(searchHistory));// places item pushed into local storage with
            showHistory(searchTerm);
        }
        $("#weatherCurrent").empty();

        return response.json();
    })
    .then((data) => {
        console.log(data);
    });
}