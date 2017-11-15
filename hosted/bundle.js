'use strict';

var handleDomo = function handleDomo(e, csrf) {
  e.preventDefault();

  $('#domoMessage').animate({ width: 'hide' }, 350);

  if ($('#domoName').val() === '' || $('#domoAge').val() === '' || $('#domostrength').val() === '') {
    handleError('RAWR! All fields are required!');
    return false;
  }

  sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), function () {
    loadDomosFromServer(csrf);
  });

  return false;
};

var deleteDomo = function deleteDomo(e, id, csrf) {
  e.preventDefault();

  $('domoMessage').animate({ width: 'hide' }, 350);

  sendAjax('POST', '/deleteDomo', 'id=' + id + '&_csrf=' + csrf, function () {
    loadDomosFromServer(csrf);
  });
};

var DomoForm = function DomoForm(props) {
  return React.createElement(
    'form',
    { id: 'domoForm',
      onSubmit: function onSubmit(e) {
        handleDomo(e, props.csrf);
      },
      name: 'domoForm',
      action: '/maker',
      method: 'POST',
      className: 'domoForm' },
    React.createElement(
      'label',
      { htmlFor: 'name' },
      'Name: '
    ),
    React.createElement('input', { id: 'domoName', type: 'text', name: 'name', placeholder: 'Domo Name' }),
    React.createElement(
      'label',
      { htmlFor: 'age' },
      'Age: '
    ),
    React.createElement('input', { id: 'domoAge', type: 'text', name: 'age', placeholder: 'Domo Age' }),
    React.createElement(
      'label',
      { htmlFor: 'strength' },
      'Strength: '
    ),
    React.createElement('input', { id: 'domoStrength', type: 'text', name: 'strength', placeholder: 'Domo Strength' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Make Domo' })
  );
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return React.createElement(
      'div',
      { className: 'domoList' },
      React.createElement(
        'h3',
        { className: 'emptyDomo' },
        'No Domos yet.'
      )
    );
  }

  var domoNodes = props.domos.map(function (domo) {
    return React.createElement(
      'div',
      { key: domo._id, className: 'domo' },
      React.createElement('img', { src: '/assets/img/domoface.jpeg', alt: 'domo face', className: 'domoFace' }),
      React.createElement(
        'h3',
        { className: 'domoName' },
        ' Name: ',
        domo.name,
        ' '
      ),
      React.createElement(
        'h3',
        { className: 'domoAge' },
        ' Age: ',
        domo.age,
        ' '
      ),
      React.createElement(
        'h3',
        { className: 'domoStrength' },
        ' Strength: ',
        domo.strength,
        ' '
      ),
      React.createElement(
        'button',
        { onClick: function onClick(e) {
            deleteDomo(e, domo._id, props.csrf);
          } },
        'DELETE'
      )
    );
  });

  return React.createElement(
    'div',
    { className: 'domoList' },
    domoNodes
  );
};

var loadDomosFromServer = function loadDomosFromServer(csrf) {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render(React.createElement(DomoList, { domos: data.domos, csrf: csrf }), document.querySelector('#domos'));
  });
};

var setup = function setup(csrf) {

  ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector('#makeDomo'));

  ReactDOM.render(React.createElement(DomoList, { domos: [], csrf: csrf }), document.querySelector('#domos'));

  loadDomosFromServer(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', 'getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
'use strict';

var handleError = function handleError(message) {
  $('#errorMessage').text(message);
  $('#domoMessage').animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $('#domoMessage').animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
