export function UserStatus(param, cb) {
  return fetch(`api/status`, {
    method: 'GET',
    accept: 'application/json',
    credentials: 'include',
  }).then(checkStatus)
    .then(parseResponse)
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
    .then(parseResponse)
    .then(cb);
}

export function Logout(param, cb) {
  return fetch(`api/logout`, {
    method: 'GET',
    accept: 'application/json',
    credentials: 'include',
  }).then(checkStatus)
    .then(parseResponse)
    .then(cb);
}

export function Buckets(param, cb) {
  return fetch(`api/buckets`, {
    method: 'GET',
    accept: 'application/json',
    credentials: 'include',
  }).then(checkStatus)
    .then(parseResponse)
    .then(checkSession)
    .then(cb);
}

export function Files(param, cb) {
  return fetch(`api/files?bucketid=${param}`, {
    method: 'GET',
    accept: 'application/json',
    credentials: 'include',
  }).then(checkStatus)
    .then(parseResponse)
    .then(checkSession)
    .then(cb);
}

export function Download(fileid, filename, cb) {
  return fetch(`api/download?fileid=${fileid}&filename=${filename}`, {
    method: 'GET',
    credentials: 'include',
  }).then(checkStatus)
    .then(parseResponse)
    .then(checkSession)
    .then(cb);
}

export function DownloadStatus(param, cb) {
  return fetch(`api/downloadstatus`, {
    method: 'GET',
    credentials: 'include',
  }).then(checkStatus)
    .then(parseResponse)
    .then(checkSession)
    .then(cb);
}

/*
export function UploadToStorj(param, cb) {
  return fetch(`api/storj`, {
    method: 'GET',
    accept: 'application/json',
    credentials: 'include',
  }).then(checkStatus)
    .then(parseResponse)
    .then(checkSession)
    .then(cb);
}
*/

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  else {
    /*
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    throw error;
    */
    window.location.href='/';
  }
}

function checkSession(json){
  if (json.isSessionInactive) {
    window.location.href='/';
  }
  else {
    return json;
  }
}

function parseResponse(response) {
  var contenttype = response.headers.get('content-type').split(';');
  if (contenttype[0] === 'application/json') {
    return response.json();
  }
  else {
    return response.blob();
  }
}
