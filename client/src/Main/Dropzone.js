import React, {Component} from 'react';
import DropzoneComponent from 'react-dropzone-component';
import '../css/filepicker.css';
import '../css/dropzone.css';

class Dropzone extends Component {

  render() {

     var ReactDOMServer = require('react-dom/server');

    /*
    var processingCallback = function() {
      console.log('Processing...');
    }
    */

    const handleShowMyFiles = this.props.handleShowMyFiles;

    var completeCallback = function(file, response) {
      if (response.isSessionInactive) {
        window.location.href='/';
      }
      if (response.isUploaded) {
        handleShowMyFiles();
      }
    }

    var componentConfig = {
      iconFiletypes: ['File'],
      showFiletypeIcon: false,
      postUrl: '/api/upload'
    };

    var djsConfig = {
      createImageThumbnails: false,
      autoProcessQueue: true,
      addRemoveLinks: true,
      parallelUploads: 1,
      clickable: true,
      maxFilesize: 10,
      dictFileTooBig: 'File is to large',
      maxFiles: 10,
      dictMaxFilesExceeded: 'Exceeded maximum allowable files',
      previewTemplate: ReactDOMServer.renderToStaticMarkup(
                        <div className="dz-preview">
                          <div className="dz-progress"><i className="fa fa-spinner fa-spin fa-3x fa-fw"></i></div>
                          <div className="dz-success-mark"><i className="fa fa-check-circle fa-5x"></i></div>
                          <div className="dz-error-mark"><i className="fa fa-times-circle fa-5x"></i></div>
                          <div className="dz-error-message"><span data-dz-errormessage="true"></span></div>
                          <div className="dz-filename"><span data-dz-name="true"></span></div>
                        </div>
                      )
    };

    var eventHandlers = {
      /* addedfile: (file) => console.log(file), */
      /* processing: processingCallback, */
      success: completeCallback
    };

    return (

      <DropzoneComponent config={componentConfig} eventHandlers={eventHandlers} djsConfig={djsConfig}/>

    );

  }

}

export {Dropzone};
