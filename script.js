const key = "1a3fbe9e11c24ff68ab161515251304";
let loaction = "Mumbai";

addEventListener("DOMContentLoaded",() => {
  getInput(loaction);
})

function getInput(searchedLoc) {
  if (!searchedLoc) {
    searchedLoc = loaction;
  }
  fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${searchedLoc}&days=3&aqi=yes&alerts=yes`
  )
    .then((res) => res.json())
    .then((data) => {
      const weatherData = data;
      updateForecastData(weatherData);
    });
}

const input = document.querySelector(".inputLoc");
input.addEventListener("keydown", (e) => {
  if (e.key == "Enter") getInput(input.value);
  else {
    searchButton.addEventListener("click", () => {
      getInput(input.value);
    });
  }
});

let locationName = document.querySelector(".nav-loc-name");
let searchButton = document.querySelector(".searchButton");
let currentWeatherTime = document.querySelector(".current-weather-time");
let currentWeatherBox2 = document.querySelector(".current-weather-box2");
let properties = document.querySelectorAll(".property");
let astroValue = document.querySelectorAll(".astroValue");
let aqiValueElement = document.querySelector(".aqiValue");

const weatherProperty = {
  wind: "wind_kph",
  pressure: "pressure_in",
  precip: "precip_in",
  humidity: "humidity",
  cloud: "cloud",
  visiblity: "vis_km",
};
const weatherSummary = {
  sunriseTime: "sunrise",
  sunsetTime: "sunset",
  moonriseTime: "moonrise",
  moonsetTime: "moonset",
};

function updateForecastData(weatherData) {
  locationName.innerText = weatherData.location.name.toUpperCase();
  currentWeatherBox2.firstElementChild.firstElementChild.setAttribute("src", "https:" + weatherData.current.condition.icon)
  currentWeatherBox2.firstElementChild.nextElementSibling.innerText = weatherData.current.temp_c + "°C"
  currentWeatherBox2.firstElementChild.nextElementSibling.nextElementSibling.innerText = weatherData.current.condition.text

  const currentTime = new Date(weatherData.current.last_updated);
  currentWeatherTime.innerText =
    currentTime.getHours() + ":" + currentTime.getMinutes();

  Array.from(properties)
    .map((p) => {
      return p.nextElementSibling;
    })
    .map((property) => {
      if (property.getAttribute("class") in weatherProperty) {
        const propertyKey = weatherProperty[property.getAttribute("class")];
        property.innerText = weatherData.current[propertyKey];
      }
    });

  Array.from(astroValue)
    .map((s) => s.nextElementSibling)
    .map((p) => {
      if (p.getAttribute("class") in weatherSummary) {
        const astroTime =
          weatherData.forecast.forecastday[0].astro[
            weatherSummary[[p.getAttribute("class")]]
          ];
        p.innerText = astroTime;
      }
    });
  const hourlyData = weatherData.forecast.forecastday[0].hour;
  hourlyData.map((hourData) => {
    let time = new Date(hourData.time).getHours() + ":00";

    const hourlyTimeElement = Array.from(
      document.querySelectorAll(".hourly-time")
    );
    hourlyTimeElement.map((element) => {
      if (time == element.innerText) {
        element.nextElementSibling.innerText = hourData.condition.text;
        element.parentElement.previousElementSibling.firstElementChild.setAttribute(
          "src",
          "https:" + hourData.condition.icon
        );
      }
    });
  });
}

