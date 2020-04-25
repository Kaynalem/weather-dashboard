const APIKey = "71f0affdf4c99a202cf0423a9baf6d29";

$(document).ready(function () {
    //when search button is clicked
    $("#searchBtn").on("click", function () {
        const searchTerm = $("#searchCity").val().trim();
        $("#searchCity").val("");
        weatherCurrent(searchTerm);//current weather for city
        weatherForecast(searchTerm);//5-day forecast for city
    });
    //when enter button pressed
    $("#searchCity").on('keyup', function (e) {
        const searchTerm = $("#searchCity").val().trim();
        console.log(searchTerm);
        if (e.keyCode === 13) {
            weatherCurrent(searchTerm);//current weather for city
            weatherForecast(searchTerm);//5-day forecast for city
        }
    });
    
});    
function weatherCurrent(searchTerm) {
    fetch('http://api.openweathermap.org/data/2.5/weather?q=' + searchTerm + '&appid=' + APIKey)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);
    });
}