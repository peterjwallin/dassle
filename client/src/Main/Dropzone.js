import React, {Component} from 'react';
import DropzoneComponent from 'react-dropzone-component';
import '../css/filepicker.css';
import '../css/dropzone.css';

class Dropzone extends Component {

  render() {

    var ReactDOMServer = require('react-dom/server');

    console.log('Rendering Dropzone');

    var processingCallback = function() {
      console.log('Processing...');
    }

    const handleShowMyFiles = this.props.handleShowMyFiles;

    var completeCallback = function() {
      handleShowMyFiles();
    }

    var componentConfig = {
      iconFiletypes: ['File'],
      showFiletypeIcon: false,
      postUrl: '/api/upload'
    };

    var djsConfig = {
      createImageThumbnails: true,
      autoProcessQueue: true,
      addRemoveLinks: true,
      parallelUploads: 1,
      clickable: false,
      maxFilesize: 100,
      dictFileTooBig: 'File is to large',
      maxFiles: 10,
      dictMaxFilesExceeded: 'Exceeded maximum allowable files',
    };

    var eventHandlers = {
      /* addedfile: (file) => console.log(file), */
      processing: processingCallback,
      success: completeCallback
    };

    return (

      <DropzoneComponent config={componentConfig} eventHandlers={eventHandlers} djsConfig={djsConfig}/>

    );

  }

}

export {Dropzone};
