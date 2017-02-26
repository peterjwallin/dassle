export function UserStatus(param, cb) {
  return fetch(`api/status`, {
    method: 'GET',
    accept: 'application/json',
    credentials: 'include',
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

export function Authenticate(param, cb) {
  return fetch(`api/auth`, {
    method: 'POST',
    mode: 'cors',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'passphrase=' + param,
    accept: 'application/json',
    credentials: 'include',
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

export function Logout(param, cb) {
  return fetch(`api/logout`, {
    method: 'GET',
    accept: 'application/json',
    credentials: 'include',
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

export function Buckets(param, cb) {
  return fetch(`api/buckets`, {
    method: 'GET',
    accept: 'application/json',
    credentials: 'include',
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

export function Files(param, cb) {
  return fetch(`api/files?bucketid=${param}`, {
    method: 'GET',
    accept: 'application/json',
    credentials: 'include',
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

export function Download(fileid, filename, cb) {
  return fetch(`api/download?fileid=${fileid}&filename=${filename}`, {
    method: 'GET',
    credentials: 'include',
  }).then(checkStatus)
    .then(returnBlob)
    .then(cb);
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    //console.log(error); // eslint-disable-line no-console
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

function returnBlob(response){
  return response.blob();
}
