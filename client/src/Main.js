import React, {Component} from 'react';

import Griddle from 'griddle-react';
import DropzoneComponent from 'react-dropzone-component';
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

    var NameComponent = React.createClass({
      render: function(){
        return <a href='#'><i className="fa fa-folder fa-2x"></i>&nbsp;{this.props.data}</a>
      }
    });

    var DateComponent = React.createClass({
      render: function(){
        return <div>{this.props.data.substring(0,10)}</div>
      }
    });

    var colStyle = [
      {
        "columnName": "name",
        "order": 1,
        "locked": false,
        "visible": true,
        "displayName": "Bucket",
        "customComponent": NameComponent
      },
      {
        "columnName": "created",
        "order": 2,
        "locked": false,
        "visible": true,
        "displayName": "Creation Date",
        "customComponent": DateComponent
      },
      {
        "columnName": "id",
        "order": 3,
        "locked": false,
        "visible": false,
        "displayName": "Id"
      }
    ];

    return this.state.showBuckets? <Griddle results={this.state.buckets} showFilter={false} columnMetadata={colStyle}
                                  showSettings={false} columns={['name', 'created', 'id']} resultsPerPage={9} useGriddleStyles={true}
                                  noDataMessage={null} initialSort={'name'} onRowClick={this.handleShowMyFilesClick.bind(this)}/> : null

  }

  renderFiles() {

    var FileNameComponent = React.createClass({
      render: function(){
        return <a href='#'><i className="fa fa-file-o fa-1x"></i>&nbsp;{this.props.data}</a>
      }
    });

    var colStyle = [
      {
        "columnName": "filename",
        "order": 1,
        "locked": false,
        "visible": true,
        "displayName": "File",
        "customComponent": FileNameComponent
      },
      {
        "columnName": "size",
        "order": 2,
        "locked": false,
        "visible": true,
        "displayName": "Size"
      },
      {
        "columnName": "id",
        "order": 3,
        "locked": false,
        "visible": true,
        "displayName": "Id"
      },
      {
        "columnName": "mimetype",
        "order": 4,
        "locked": false,
        "visible": true,
        "displayName": "Mime Type"
      }
    ];

    return this.state.myFiles? <Griddle results={this.state.files} showFilter={false} columnMetadata={colStyle}
                                  showSettings={false} columns={['filename', 'size', 'id', 'mimetype']} resultsPerPage={5} useGriddleStyles={true}
                                  noDataMessage={null} initialSort={'name'} onRowClick={this.handleDownloadClick.bind(this)}/> : null

  }

  //Upload Pane
  renderDropZone() {

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
      postUrl: '/api/dzupload'
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
      queuecomplete: completeCallback
    };

    return this.state.myFiles? <DropzoneComponent config={componentConfig} eventHandlers={eventHandlers} djsConfig={djsConfig}/> : null

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
