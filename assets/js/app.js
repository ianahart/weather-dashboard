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

  // display the 5 day weather forecast by looping through the forecast
  // and rendering out a day with the proper properties.
  function displayWeatherForecast(forecast) {
    var weatherResultsContainer = $('#weatherResults');
    var forecastRow = $('<section>').addClass('justify-content-around row');

    for (var i = 0; i < forecast.length; i++) {
      var forecastCol = $('<div>').addClass('col bg-dark rounded m-2 p-1');
      var dateEl = $('<h3>')
        .addClass('text-light h6')
        .text(dayjs(forecast[i].dt_txt).format('MM/DD/YYYY'));
      var weatherIconEl = createWeatherIconImage(forecast[i].weather[0].icon);
      var statsEl = createCurrentWeatherStats(forecast[i]);
      $(statsEl).addClass('text-light');

      forecastCol.append(dateEl, weatherIconEl, statsEl);
      forecastRow.append(forecastCol);
      weatherResultsContainer.append(forecastRow);
    }
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

  // append all the weather stats to a container element
  function createCurrentWeatherStats(data) {
    var containerEl = $('<div>').addClass('m-1');
    var tempEl = $('<p>').text('Temp: ' + data.main.temp + '\u00B0F');
    var windEl = $('<p>').text('Wind: ' + data.wind.speed + 'MPH');
    var humidityEl = $('<p>').text('Humidity: ' + data.main.humidity + '%');

    containerEl.append(tempEl, windEl, humidityEl);

    return containerEl;
  }

  // render the current weather component
  function displayCurrentWeather(data) {
    var weatherResultsContainer = $('#weatherResults');
    var currentWeatherContainerEl = $('<section>').addClass(
      'border rounded border w-100 p-1'
    );
    var currentWeatherTitleEl = createCurrentWeatherTitle(data);
    currentWeatherTitleEl.appendTo(currentWeatherContainerEl);

    var currentWeatherStats = createCurrentWeatherStats(data);
    currentWeatherStats.appendTo(currentWeatherContainerEl);

    currentWeatherContainerEl.appendTo(weatherResultsContainer);
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

    $('#weatherResults').empty();

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
        displayWeatherForecast(fiveDayForecast);
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
        displayCurrentWeather(data);
      });
    return { lat, lon };
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
        return getCurrentWeather(lat, lon);
      })
      .then(function (data) {
        console.log(data);
        getWeatherForecast(data.lat, data.lon);
      });
  }

  function init() {
    //renderPreviousWeather
  }

  $('#form').on('submit', handleFormSubmit);
});
