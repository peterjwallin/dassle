export function UserStatus(query, cb) {
  //return fetch(`api/food?q=${query}`, {
  return fetch(`api/status`, {
    method: 'GET',
    accept: 'application/json',
    credentials: 'include',
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

export function Authenticate(query, cb) {
  //return fetch(`api/food?q=${query}`, {
  return fetch(`api/auth?passphrase=${query}`, {
    method: 'GET',
    accept: 'application/json',
    credentials: 'include',
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error); // eslint-disable-line no-console
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}
