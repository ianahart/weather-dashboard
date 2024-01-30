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
  // 5th day
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
      '&appid=' +
      API_KEY;

    fetch(requestURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(`current weather:`, data);
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
