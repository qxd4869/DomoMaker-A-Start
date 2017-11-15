const handleDomo = (e) => {
  e.preventDefault();
  
  $('#domoMessage').animate({ width: 'hide' }, 350);
  
  if ($('#domoName').val() === '' || $('#domoAge').val() === '' || $('#domostrength').val() === '') {
    handleError('RAWR! All fields are required!');
    return false;
  }
  
  sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), () => {
    loadDomosFromServer();
  });
  
  return false;
};

const deleteDomo = (e, id, csrf) => {
  e.preventDefault();
 
  $('domoMessage').animate({ width: 'hide' }, 350);

  sendAjax('POST', '/deleteDomo', `id=${id}&_csrf=${csrf}`, loadDomosFromServer);
  
};

const DomoForm = (props) => {
  return (
    <form id="domoForm"
          onSubmit={handleDomo}
          name="domoForm"
          action="/maker"
          method="POST"
          className="domoForm">
      <label htmlFor="name">Name: </label>
      <input id="domoName" type="text" name="name" placeholder="Domo Name" />
      <label htmlFor="age">Age: </label>
      <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
      <label htmlFor="strength">Strength: </label>
      <input id="domoStrength" type="text" name="strength" placeholder="Domo Strength" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="makeDomoSubmit" type="submit" value="Make Domo" />
    </form>
  );
};

const DomoList = (props) => {
  if (props.domos.length === 0) {
    return (
      <div className="domoList">
        <h3 className="emptyDomo">No Domos yet.</h3>
      </div>
    );
  }
  
  const domoNodes = props.domos.map((domo) => {
    return (
      <div key={domo._id} className="domo">
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
        <h3 className="domoName"> Name: {domo.name} </h3>
        <h3 className="domoAge"> Age: {domo.age} </h3>
        <h3 className="domoStrength"> Strength: {domo.strength} </h3>
        <button onClick={(e) => { deleteDomo(e, domo._id, props.csrf ); }}>
              DELETE
        </button>
      </div>
    );
  });
  
  return (
    <div className="domoList">
      {domoNodes}
    </div>
  );
};

const loadDomosFromServer = () => {
  sendAjax('GET', '/getDomos', null, (data) => {
    ReactDOM.render(
      <DomoList domos={data.domos} />,
      document.querySelector('#domos'),
    );
  });
};

const setup = (csrf) => {
  globalCsrfToken = csrf;
  
  ReactDOM.render(
    <DomoForm csrf={csrf} />,
    document.querySelector('#makeDomo'),
  );
  
  ReactDOM.render(
    <DomoList domos={[]} />,
    document.querySelector('#domos'),
  );
  
  loadDomosFromServer();
};

const getToken = () => {
  sendAjax('GET', 'getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(() => {
  getToken();
});