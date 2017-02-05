import React, {Component} from 'react';

class Dropzone extends Component {

  render() {

    //Upload Functions
    function handleCompletedUploads(bucketid) {
      console.log('Running callback', bucketid)
      /*Files(bucketid, (result) => {
        result.files? this.setState({files: result.files}) : this.setState({isFiles: result.isFiles})
      });*/
    }

    var completeCallback = function () {
        handleCompletedUploads(this.state.bucketid);
    };

    var componentConfig = {
      iconFiletypes: ['File'],
      showFiletypeIcon: true,
      postUrl: '/api/upload'
    };

    var djsConfig = {
      autoProcessQueue: true,
      addRemoveLinks: true,
      parallelUploads: 1,
      clickable: false,
      maxFilesize: 100,
      dictFileTooBig: 'File is to large',
      maxFiles: 10,
      dictMaxFilesExceeded: 'Exceeded maximum allowable files'
    };

    var eventHandlers = {
      /* addedfile: (file) => console.log(file), */
      queuecomplete: completeCallback
    };

    return (



    );

  }

}

export {Dropzone};
