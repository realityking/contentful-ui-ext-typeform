import 'core-js/fn/array/find-index';
import 'core-js/es6/promise';
import 'whatwg-fetch';

document.addEventListener("DOMContentLoaded", function() {
  window.contentfulExtension.init(function (api) {
    api.window.startAutoResizer();

    var value = api.field.getValue();
    var accessToken = api.parameters.installation.accessToken;
    var selectField = document.getElementById('typeform-select');

    fetch('https://api.typeform.com/forms?page_size=200', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var forms = data.items;

        forms.forEach(function(value, index) {
          var option = document.createElement("option");
          option.setAttribute("value", value.id);
          option.innerText = value.title;
          selectField.appendChild(option);
        });

        if (!value) {
          // The field is empty, no need to select anything
          return;
        }

        var prevValueIndex = forms.findIndex(function (form) {
          return form.id === value;
        });

        if (prevValueIndex > -1) {
          selectField.value = value;
        } else {
          var warningElem = document.getElementById('warning-missing-form');
          warningElem.className = warningElem.className + ' shown';
        }
      })
      .catch(function () {
        var warningElem = document.getElementById('warning-data-error');
        warningElem.className = warningElem.className + ' shown';
      });

    selectField.addEventListener('change', function (event) {
      var value = event.target.value;

      api.field.setValue(value === '-1' ? undefined : value);
    });
  });
});

