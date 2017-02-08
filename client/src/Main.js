import React, {Component} from 'react';
import {BucketList} from './Main/BucketList';
import {FileList} from './Main/FileList';
import {Dropzone} from './Main/Dropzone';
import {Buckets} from './Client';
import {Files} from './Client';
import './css/filepicker.css';
import './css/dropzone.css';

class Main extends Component {

  constructor(props) {
    super(props);
    this.handleShowBucketsClick = this.handleShowBucketsClick.bind(this);
    this.handleShowMyFilesClick = this.handleShowMyFilesClick.bind(this);
    this.handleUploadClick = this.handleUploadClick.bind(this);
    this.handleCreateBucketClick = this.handleCreateBucketClick.bind(this);
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
    this.handleShowMyFiles = this.handleShowMyFiles.bind(this);
    this.state = {
      showBuckets: true,
      myFiles: false,
      upload: false,
      createBucket: false,
      isBuckets: true,
      buckets: [],
      bucketID: null,
      bucketName: null,
      isFiles: false,
      files: [],
    };
  }

  componentWillMount() {
    Buckets('', (result) => {
      if (result.buckets) {
        this.setState({buckets: result.buckets});
      } else {
        this.setState({isBuckets: result.isBuckets});
      }
    });
  }

  //Click Functions
  handleShowBucketsClick() {
    this.setState({showBuckets:true});
    this.setState({myFiles:false});
    this.setState({upload:false});
    this.setState({createBucket:false});
  }

  handleShowMyFilesClick(row) {
    Files(row.props.data.id, (result) => {
      if (result.files) {
        this.setState({files: result.files});
      } else {
        this.setState({isFiles: result.isFiles});
      }
    });
    this.setState({bucketID:row.props.data.id});
    this.setState({bucketName:row.props.data.name});
    this.setState({showBuckets:false});
    this.setState({myFiles:true});
    this.setState({upload:false});
    this.setState({createBucket:false});
  }

  handleShowMyFiles() {
    Files(this.state.bucketID, (result) => {
      if (result.files) {
        this.setState({files: result.files});
      } else {
        this.setState({isFiles: result.isFiles});
      }
    });
  }

  handleUploadClick() {
    this.setState({showBuckets:false});
    this.setState({myFiles:false});
    this.setState({upload:true});
    this.setState({createBucket:false});
  }

  handleCreateBucketClick() {
    this.setState({showBuckets:false});
    this.setState({myFiles:false});
    this.setState({upload:false});
    this.setState({createBucket:true});
  }

  handleDownloadClick() {
    console.log('Need to wire up download');
  }

  // Render Components
  renderMyFilesLink() {
    return <MyFilesLink onClick={this.handleShowBucketsClick} />
  }

  renderUploadLink() {
    return <UploadLink onClick={this.handleUploadClick} />
  }

  renderCreateBucketLink() {
    return <CreateBucketLink onClick={this.handleCreateBucketClick} />
  }

  renderBuckets() {
    return this.state.showBuckets? <BucketList buckets={this.state.buckets} onClick={this.handleShowMyFilesClick.bind(this)} /> : null
  }

  renderFiles() {
    return this.state.myFiles? <FileList filelist={this.state.files} onClick={this.handleDownloadClick.bind(this)} /> : null
  }

  //Upload Pane
  renderDropZone() {

    /*
    const handleShowMyFiles = this.handleShowMyFiles;

    var completeCallback = function() {
      handleShowMyFiles();
    }

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
      addedfile: (file) => console.log(file),
      success: completeCallback
    };

    return this.state.myFiles? <DropzoneComponent config={componentConfig} eventHandlers={eventHandlers} djsConfig={djsConfig}/> : null

    */

    return this.state.myFiles? <Dropzone handleShowMyFiles={this.handleShowMyFiles} /> : null

  }

  renderMyFilesHeader() {
    return this.state.myFiles? <p>{this.state.bucketName}</p> : null
  }

  renderUpload() {
    return this.state.upload? <h1>Upload File</h1> : null
  }

  renderCreateBucket() {
    return this.state.createBucket? <h1>CreateBucket</h1> : null
  }

  render() {

      return (

        <div className='container'>
          <br/>
          <div className='row'>
            <div className='col-xs-2 dass-link'>{this.renderMyFilesLink()}</div>
            <div className='col-xs-2 dass-link'>{this.renderUploadLink()}</div>
            <div className='col-xs-2 dass-link'>{this.renderCreateBucketLink()}</div>
          </div>
          <div className='row'>
            <div className='col-xs-12'><hr/></div>
          </div>
          <div className='row'>
            <div className='col-xs-12 dass-folder'>{this.renderBuckets()}</div>
            <div className='col-xs-12'>{this.renderMyFilesHeader()}</div>
            <div className='col-xs-12 dass-file'>{this.renderFiles()}</div>
            <div className='col-xs-12'>{this.renderUpload()}</div>
            <div className='col-xs-12'>{this.renderCreateBucket()}</div>
          </div>
          <div className='row'>
            <br/>
            <div className='col-xs-12'>{this.renderDropZone()}</div>
          </div>
        </div>

      );

  }

}

function MyFilesLink(props) {
  return (
    <a href='#' onClick={props.onClick}><span className='glyphicon glyphicon-file'></span>&nbsp;My Files</a>
  );
}

function UploadLink(props) {
  return (
    <a href='#' onClick={props.onClick}><span className='glyphicon glyphicon-cloud-upload'></span>&nbsp;Upload</a>
  );
}

function CreateBucketLink(props) {
  return (
    <a href='#' onClick={props.onClick}><span className='glyphicon glyphicon-folder-open'></span>&nbsp;&nbsp;Create Bucket</a>
  );
}

export {Main};
