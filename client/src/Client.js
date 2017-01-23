export function UserStatus(query, cb) {
  return fetch(`api/status`, {
    method: 'GET',
    accept: 'application/json',
    credentials: 'include',
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

export function Authenticate(query, cb) {
  return fetch(`api/auth?passphrase=${query}`, {
    method: 'GET',
    accept: 'application/json',
    credentials: 'include',
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

export function Logout(query, cb) {
  return fetch(`api/logout`, {
    method: 'GET',
    accept: 'application/json',
    credentials: 'include',
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

export function Buckets(query, cb) {
  return fetch(`api/buckets`, {
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
