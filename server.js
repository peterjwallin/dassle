var express = require('express');
var fs = require('fs');
var storj = require('storj-lib');
var session = require('client-sessions');
var through = require('through');
var mnemonic = require('bitcore-mnemonic');
var bitcore = require('bitcore-lib');
var dotenv = require('dotenv');
var bodyParser = require('body-parser');
var multer  = require('multer');
var stream = require('stream');

//Storj variables
const api = 'https://api.storj.io';
var client;

//Multer variables
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
  files: 10,
  fields: 5,
  fileSize: 100000000
  }
});

// Key ring directory
const USER_DIR = './.users/';

//Setup app
const app = express();
dotenv.load();
app.set('port', (process.env.PORT || 3001));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}
else {
  app.use(express.static(__dirname + 'client/public'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  cookieName: 'session',
  secret: process.env.SESSION_SECRET,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

//Middleware
var myLogger = function (req, res, next) {
  console.log('LOGGED')
  next();
}

app.use(myLogger);

//Status
app.get('/api/status', (req, res) => {

  console.log('**** Executing /api/status ****');

  var status = false;

  if (req.session.authenticated && client) {
    status = true;
  }

  return res.json({isLoggedIn: status});

});

//Authentication
app.post('/api/auth', (req, res) => {

  console.log('**** Executing /api/auth ****');

  req.session.authenticated = false;
  client = null;

  const passphrase = req.body.passphrase;

  if (!passphrase) {
    return res.json({isLoggedIn: false});
  }

  //Create Private Key from Mnemonic
  const value = new Buffer(passphrase);
  const hash = bitcore.crypto.Hash.sha256(value);
  const bn = bitcore.crypto.BN.fromBuffer(hash);
  const privateKey = new bitcore.PrivateKey(bn);
  //var address = privateKey.toAddress();
  //console.log('Created private key', address);

  // Login using the keypair
  const keypair = storj.KeyPair(privateKey.toWIF());
  client = storj.BridgeClient(api, { keyPair: keypair });

  //Check if Login successful
  client.getPublicKeys(function(err, keys) {
    if (err) {
      req.session.authenticated = false;
      return res.json({isLoggedIn: false});
    }
    else {
      //Login was successful
      req.session.authenticated = true;
      req.session.passphrase = passphrase;
      req.session.userdir = USER_DIR + keys[0].user;
      return res.json({isLoggedIn: true});
    }
  });

});

// Logoff
app.get('/api/logout', (req, res) => {

  console.log('**** Executing /api/logout ****');

  req.session.authenticated = false;
  client = null;
  return res.json({isLoggedOut: true});

});

// Get buckets
app.get('/api/buckets', (req, res) => {

  console.log('**** Executing /api/buckets ****');

  if (!req.session.authenticated || !client) {
    return res.json({isSessionInactive: true});
  }

  client.getBuckets(function(err, buckets) {
    if (err) {
      return res.json({isBuckets: false});
    }
    else {
      if (buckets) {
        return res.json({buckets});
      } else {
        return res.json({isBuckets: false});
      }
    }
  });

});

// Get files
app.get('/api/files', (req, res) => {

  console.log('**** Executing /api/files ****');

  if (!req.session.authenticated || !client) {
    return res.json({isSessionInactive: true});
  }

  const bucketid = req.query.bucketid;
  req.session.bucketid = bucketid;

  if (!bucketid) {
    return res.json({isFiles: false});
  }

  client.listFilesInBucket(bucketid, function(err, files) {
    if (err) {
      return res.json({isFiles: false});
    }
    if (files) {
      return res.json({files});
    } else {
      return res.json({isFiles: false});
    }
  });

});

//Upload
app.post('/api/upload', upload.single('file'),  (req, res) => {

  console.log('**** Executing /api/upload ****');

  if (!req.session.authenticated || !client) {
    return res.json({isSessionInactive: true});
  }

  if (req.file && req.file.originalname) {

    console.log('File Name', req.file.originalname);
    console.log('Buffer', req.file.buffer);

    const bucketid = req.session.bucketid;
    console.log('Bucket', bucketid);

    const userdir = req.session.userdir;
    console.log('User Directory', userdir);

    const encryptpath = userdir + '/' + req.file.originalname + '.crypt';
    console.log('Encrypted File Path', encryptpath);

    const keyring = storj.KeyRing(userdir, req.session.passphrase);

    if (!keyring) {
      console.log('error', err.message);
      return res.json({isUploaded: false});
    }
    else {
      console.log('Created keyring');
    }

    //Read file stream
    const bufferStream = new stream.PassThrough();
    const filebuffer = Buffer.from(req.file.buffer);
    bufferStream.end(filebuffer);

    // Prepare to encrypt file for upload
    const secret = new storj.DataCipherKeyIv();
    const encrypter = new storj.EncryptStream(secret);

    // Encrypt the file to be uploaded and store it temporarily
    bufferStream
      .pipe(encrypter)
      .pipe(fs.createWriteStream(encryptpath))
      .on('finish', function() {

      console.log('Finished encrypting');

      // Create token for uploading to bucket by bucketId
      client.createToken(bucketid, 'PUSH', function(err, token) {
        if (err) {
          console.log('error', err.message);
          return res.json({isUploaded: false});
        }

        if (token) {
          console.log('Created token');
        }

        // Store the file using the bucketId, token, and encrypted file
        client.storeFileInBucket(bucketid, token.token, encryptpath, function(err, file) {
          if (err) {
            console.log('error', err.message);
            return res.json({isUploaded: false});
          }

          console.log('Stored file in bucket');

          // Save key for access to download file
          keyring.set(file.id, secret);

          // Delete tmp file
          fs.unlink(encryptpath, function(err) {
            if (err) {
              console.log('error', err.message);
            }
            console.log('Temporary encrypted file deleted');
          })

          return res.json({isUploaded: true});

        });

      });

    });

  }
  else {
    return res.json({isUploaded: false});
  }

});

//Download
app.get('/api/download', (req, res) => {

  console.log('**** Executing /api/download ****');

  if (!req.session.authenticated || !client) {
    return res.json({isSessionInactive: true});
  }

  const bucketid = req.session.bucketid;
  const fileid = req.query.fileid;
  const filename = req.query.filename;

  console.log('bucketid...', bucketid);
  console.log('fileid...', fileid);
  console.log('filename...', filename);

  if (!bucketid || !fileid || !filename) {
    return res.json({downloadFailed: true});
  }

  const userdir = req.session.userdir;
  console.log('User Directory', userdir);

  console.log('Getting keyring');
  const keyring = storj.KeyRing(userdir, req.session.passphrase);

  // Where the downloaded file will be saved
  var target = fs.createWriteStream(userdir + '/' + filename);

  // Get key to download file
  console.log('Get key for fileId');
  var secret = keyring.get(fileid);

  // Prepare to decrypt the encrypted file
  var decrypter = new storj.DecryptStream(secret);
  var received = 0;

  // Download the file
  console.log('Creating file stream');
  client.createFileStream(bucketid, fileid, { exclude: [] },function(err, stream) {
    if (err) {
      console.log('error', err.message);
      return res.json({downloadFailed: true});
    }

    // Handle stream errors
    stream.on('error', function(err) {
      console.log('error', err.message);
      // Delete the partial file
      fs.unlink(target, function(unlinkFailed) {
        if (unlinkFailed) {
          console.log('error', 'Failed to unlink partial file.');
        }
        if (!err.pointer) {
          console.log('error', 'Cannot find target.');
        }
      });
      return res.json({downloadFailed: true});
    }).pipe(through(function(chunk) {
      received += chunk.length;
      console.log('info', 'Received ' + received + ' of ' + stream._length + ' bytes');
      this.queue(chunk);
    })).pipe(decrypter)
       .pipe(target)
  });

  // Handle Events emitted from file download stream
  target.on('finish', function() {
    console.log('Downloading file');
    res.download(userdir + '/' + filename, filename);
    //Delete file
    res.on('finish', function(){
      console.log('Deleting temporary file');
      fs.unlink(userdir + '/' + filename, function(err) {
        if (err) {
          console.log('error', err.message);
        }
      });
    });
  }).on('error', function(err) {
    console.log('error', err.message);
    return res.json({downloadFailed: true});
  });

});

//Generate Key pair
app.get('/api/generate', (req, res) => {

  console.log('**** Executing /api/generate ****');

  // Create private key from passphrase
  const passphrase = new mnemonic();
  console.log('Generated passphrase', passphrase.toString());

  const value = new Buffer(passphrase.toString());
  const hash = bitcore.crypto.Hash.sha256(value);
  const bn = bitcore.crypto.BN.fromBuffer(hash);
  const privateKey = new bitcore.PrivateKey(bn);
  const wif = privateKey.toWIF();
  console.log('WIF encoded key', privateKey.toWIF());

  // Generate keypair for Storj Network
  const keypair = storj.KeyPair(privateKey.toWIF());
  console.log('Generated Storj keypair', keypair.getPublicKey());

  const dir = './.users/' + keypair.getPublicKey();
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    //fs.writeFileSync(dir + '/private.key', keypair.getPrivateKey());
  }
  console.log('Created key ring directory');

  // Add the keypair public key to the user account for authentication
  client.addPublicKey(keypair.getPublicKey(), function(err) {
    if (err) {
      return console.log('error', err.message);
    }
    console.log('Added the keypair public key to the user account');
  });

});

//Authentication with GET
app.get('/api/authget', (req, res) => {

  console.log('**** Executing /api/auth ****');

  req.session.authenticated = false;
  client = null;

  const passphrase = req.query.passphrase;

  if (!passphrase) {
    res.json({isLoggedIn: false});
    return;
  }

  //Create Private Key from Mnemonic
  const value = new Buffer(passphrase);
  const hash = bitcore.crypto.Hash.sha256(value);
  const bn = bitcore.crypto.BN.fromBuffer(hash);
  const privateKey = new bitcore.PrivateKey(bn);
  //var address = privateKey.toAddress();
  //console.log('Created private key', address);

  // Login using the keypair
  const keypair = storj.KeyPair(privateKey.toWIF());
  client = storj.BridgeClient(api, { keyPair: keypair });

  //Check if Login successful
  client.getPublicKeys(function(err, keys) {
    if (err) {
      req.session.authenticated = false;
      res.json({isLoggedIn: false});
      return;
    }
    else {
      //Login was successful
      req.session.authenticated = true;
      req.session.passphrase = passphrase;
      req.session.userdir = USER_DIR + keys[0].user;
      res.json({isLoggedIn: true});
      return;
    }
  });

});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
