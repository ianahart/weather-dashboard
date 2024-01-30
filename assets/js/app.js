$(document).ready(function () {
  var API_KEY = 'a46b075efc1105478039f5ecdad334e4';
  var baseURL = 'https://api.openweathermap.org';
  var city = '';
  var currentLatitude;
  var currentLongitude;

  // Check if form input is empty
  function validateForm(cityVal) {
    return !(cityVal.trim().length === 0);
  }

  // create an image and set its src attribute to equal weather icon
  function createWeatherIconImage(iconName) {
    var weatherIconImageEl = $('<img>');
    weatherIconImageEl.attr({
      src: 'https://openweathermap.org/img/w/' + iconName + '.png',
    });

    return weatherIconImageEl;
  }

  // Create the title of the current weather that includes the title, date, and weather icon
  function createCurrentWeatherTitle(data) {
    var containerEl = $('<div>').addClass('d-flex align-items-center');
    var currentDate = dayjs().format('MM/DD/YYYY');

    var titleEl = $('<h2>')
      .append(city + ' (' + currentDate + ')')
      .addClass('text-dark me-2');
    var weatherIconImageEl = createWeatherIconImage(data.weather[0].icon);

    titleEl.appendTo(containerEl);
    weatherIconImageEl.appendTo(containerEl);

    return containerEl;
  }

  function createCurrentWeatherStats(data) {
    var containerEl = $('<div>').addClass('m-1');
    var tempEl = $('<p>').text('Temp: ' + data.main.temp + '\u00B0F');
    var windEl = $('<p>').text('Wind: ' + data.wind.speed + 'MPH');
    var humidityEl = $('<p>').text('Humidity: ' + data.main.humidity + '%');

    containerEl.append(tempEl, windEl, humidityEl);

    return containerEl;
  }

  // render the current weather component
  function renderCurrentWeather(data) {
    var currentWeatherContainerEl = $('#currentWeather');
    var currentWeatherTitleEl = createCurrentWeatherTitle(data);
    currentWeatherTitleEl.appendTo(currentWeatherContainerEl);

    var currentWeatherStats = createCurrentWeatherStats(data);
    currentWeatherStats.appendTo(currentWeatherContainerEl);

    // city - (9/13/2022) icon
    // temp:
    // wind:
    // humidity:
  }

  // Render an error for the element passed in and assign it the error message
  function renderError(targetEl, errorMessage) {
    targetEl.addClass('text-danger').text(errorMessage);
  }

  // clear Error element's text
  function clearError(errorEl) {
    errorEl.text('');
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    clearError($('.search-error'));

    var cityVal = event.target.city.value;
    var isFormValid = validateForm(cityVal);

    if (!isFormValid) {
      renderError($('.search-error'), 'Please enter a city');
    }

    $(this.reset());
    city = cityVal;
    getLatAndLon(cityVal);
  }

  // because the OpenWeather API returns a forecast for five days for every 3 hours
  // the returned list has a count of 40 so we need to loop through it and pick every
  // x item
  function parseFiveDayForecast(data) {
    var uniqueDayNames = [];
    var fiveDayForecast = [];

    for (var i = 1; i < data.list.length; i++) {
      var dayName = dayjs(data.list[i].dt_txt).format('ddd');

      if (i % 5 === 0 && !uniqueDayNames.includes(dayName)) {
        fiveDayForecast.push(data.list[i]);
        uniqueDayNames.push(dayName);
      }
    }
    return fiveDayForecast;
  }

  // gets the 5 day forecast from OpenWeather API
  function getWeatherForecast(lat, lon) {
    var requestURL =
      baseURL +
      '/data/2.5/forecast?lat=' +
      lat +
      '&lon=' +
      lon +
      '&units=imperial' +
      '&appid=' +
      API_KEY;

    fetch(requestURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var fiveDayForecast = parseFiveDayForecast(data);
        console.log(`five day forecast:`, fiveDayForecast);
      });
  }

  // gets the current weather from OpenWeather API
  function getCurrentWeather(lat, lon) {
    var requestURL =
      baseURL +
      '/data/2.5/weather?lat=' +
      lat +
      '&lon=' +
      lon +
      '&units=imperial' +
      '&appid=' +
      API_KEY;

    fetch(requestURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        renderCurrentWeather(data);
      });
  }

  // gets the latitude and longitude from OpenWeather API
  function getLatAndLon(cityVal) {
    var requestURL =
      baseURL + '/geo/1.0/direct?q=' + cityVal + '&appid=' + API_KEY;
    fetch(requestURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var lat = data[0].lat;
        var lon = data[0].lon;
        getCurrentWeather(lat, lon);
        getWeatherForecast(lat, lon);
      });
  }

  function init() {
    //displayCurrentWeather();
  }

  $('#form').on('submit', handleFormSubmit);
});
