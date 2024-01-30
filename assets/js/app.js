$(document).ready(function () {
  var API_KEY = '';
  var city = '';
  var currentLatitude;
  var currentLongitude;

  function validateForm(cityVal) {
    return !(cityVal.trim().length === 0);
  }

  function renderError(targetEl, errorMessage) {
    targetEl.addClass('text-danger').text(errorMessage);
  }

  function clearError(errorEl, targetEl) {
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
  }

  function init() {
    //displayCurrentWeather();
  }

  $('#form').on('submit', handleFormSubmit);
});
