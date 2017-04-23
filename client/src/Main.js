import React, {Component} from 'react';
import {Modal} from 'react-bootstrap';
import {ProgressBar} from 'react-bootstrap';
import {BucketList} from './Main/BucketList';
import {FileList} from './Main/FileList';
import {Dropzone} from './Main/Dropzone';
import {Buckets, Files, StreamStorj, StreamStatus, Download} from './Client';


class Main extends Component {

  constructor(props) {
    super(props);
    this.handleMyFilesLink = this.handleMyFilesLink.bind(this);
    this.handleCreateBucketLink = this.handleCreateBucketLink.bind(this);
    this.handleToolsLink = this.handleToolsLink.bind(this);
    this.handleShowMyFilesClick = this.handleShowMyFilesClick.bind(this);
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
    this.handleShowMyFiles = this.handleShowMyFiles.bind(this);
    this.handleBucketDropdownClick = this.handleBucketDropdownClick.bind(this);
    this.handleDownloadFailedCancelClick = this.handleDownloadFailedCancelClick.bind(this);
    this.state = {
      showSubNav: false,
      showBuckets: false,
      myFiles: false,
      tools: false,
      createBucket: false,
      isBuckets: false,
      buckets: [],
      bucketID: null,
      bucketName: null,
      isFiles: false,
      files: [],
      downloadFailed: false,
      downloadMessage: null,
      downloadInprogress: false,
      downloadPercent:0,
      isSessionInactive: false
    };
  }

  componentWillMount() {
    Buckets('', (result) => {
      var isBuckets = false;
      var buckets = [];
      if (result.buckets) {
          isBuckets = true;
          buckets = result.buckets;
      }
      this.setState({
        showSubNav: true,
        showBuckets: true,
        buckets: buckets,
        isBuckets: isBuckets
      });
    });
  }

  //Sub Navigation
  handleMyFilesLink() {
    this.setState({
      showBuckets:true,
      myFiles:false,
      tools:false,
      createBucket:false
    });
  }

  handleCreateBucketLink() {
    this.setState({
      showBuckets:false,
      myFiles:false,
      tools:false,
      createBucket:true
    });
  }

  handleToolsLink() {
    this.setState({
      showBuckets:false,
      myFiles:false,
      tools:true,
      createBucket:false
    });
  }

  // Show files when clicking a bucket row
  handleShowMyFilesClick(row) {
    Files(row.props.data.id, (result) => {
      if (result) {
        this.setState({
          files: result.files,
          isFiles: result.isFiles,
          bucketID:row.props.data.id,
          bucketName:row.props.data.name,
          showBuckets:false,
          myFiles:true
        });
      }
    });
  }

  //Show files when selecting bucket from dropdown
  handleBucketDropdownClick(event) {
    const bucketid = event.target.id;
    const bucketname = event.target.name;
    Files(bucketid, (result) => {
      if (result) {
        this.setState({
          files: result.files,
          isFiles: result.isFiles,
          bucketID:bucketid,
          bucketName:bucketname,
          showBuckets:false,
          myFiles:true
        });
      }
    });
  }

  //Update file list after uploading a new file
  handleShowMyFiles() {
    Files(this.state.bucketID, (result) => {
      if (result) {
        this.setState({
          files: result.files,
          isFiles: result.isFiles
        });
      }
    });
  }

  //Download a file
  handleDownloadClick(row) {
    StreamStorj(row.props.data.id, row.props.data.filename, (result) => {
      if (result) {
        if (result.downloadFailed) {
          this.setState({
            downloadFailed:true,
            downloadMessage:'One or more items needed to download the file was missing.'
          });
        }
        else {
          const fileName = row.props.data.filename;
          var percent_complete = 0;
          var downloadstatus = setInterval(() => {
            StreamStatus('', (result) => {
              if (result.total === '-1') {
                this.setState({
                  downloadFailed:true,
                  downloadInprogress:false,
                  downloadMessage:result.message
                });
                clearInterval(downloadstatus);
              }
              else {
                percent_complete = Math.round((result.progress / result.total) * 100);
                if (percent_complete === 100) {
                  this.setState({downloadPercent:percent_complete});
                  setTimeout(() => {
                    this.setState({downloadInprogress:false});
                  },1000);
                }
                else {
                  if (result.total === '0') {
                    percent_complete = 0;
                  }
                  this.setState({
                      downloadInprogress:true,
                      downloadPercent:percent_complete
                  });
                  /*
                  console.log('File Id', result.fileid);
                  console.log('File Name', result.filename);
                  console.log('Bytes received', result.progress);
                  console.log('Bytes total', result.total);
                  console.log('% complete', percent_complete);
                  */
                }
              }
            });
            if (percent_complete === 100) {
              clearInterval(downloadstatus);
              Download('', (filedata) => {
                const data = filedata;
                var saveData = (function() {
                  var a = document.createElement('a');
                  document.body.appendChild(a);
                  a.style = 'display:none';
                  return function (data, fileName) {
                    var blob = new Blob([data]),
                    url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = fileName;
                    a.click();
                    window.URL.revokeObjectURL(url);
                  };
                }());
                saveData(data, fileName);
              });
            }
          },500);
        }
      }
    });
  }

  handleDownloadFailedCancelClick() {
    this.setState({
      downloadFailed:false
    });
  }

  // Render Components
  renderMyFilesLink() {
    return this.state.showSubNav? <MyFilesLink onClick={this.handleMyFilesLink} /> : null;
  }

  renderCreateBucketLink() {
    return this.state.showSubNav? <CreateBucketLink onClick={this.handleCreateBucketLink} /> : null;
  }

  renderToolsLink() {
    return this.state.showSubNav? <ToolsLink onClick={this.handleToolsLink} /> : null;
  }

  renderBuckets() {
    return this.state.showBuckets? <BucketList buckets={this.state.buckets} onClick={this.handleShowMyFilesClick.bind(this)} /> : null;
  }

  renderFiles() {
    return this.state.myFiles? <FileList filelist={this.state.files} onClick={this.handleDownloadClick.bind(this)} /> : null;
  }

  renderDropZone() {
    return this.state.myFiles? <Dropzone handleShowMyFiles={this.handleShowMyFiles} /> : null;
  }

  renderBucketDropdown() {
    return this.state.myFiles? <BucketDropdown bucket={this.state.bucketName} buckets={this.state.buckets} onClick={this.handleBucketDropdownClick.bind(this)} /> : null;
  }

  renderUploadButton() {
    return this.state.myFiles? <UploadButton /> : null;
  }

  renderCreateBucket() {
    return this.state.createBucket? <h1>CreateBucket</h1> : null;
  }

  renderTools() {
    return this.state.tools? <h1>Tools</h1> : null;
  }

  renderDownloadProgress() {
    return this.state.downloadInprogress? <DownloadProgress downloadInprogress={this.state.downloadInprogress} downloadPercent={this.state.downloadPercent}/> : null;
  }

  renderDownloadFailed() {
    return this.state.downloadFailed? <DownloadFailed downloadFailed={this.state.downloadFailed} downloadMessage={this.state.downloadMessage} onClick={this.handleDownloadFailedCancelClick}/> : null;
  }

  render() {

      return (

        <div className='container'>
          <div className='row'>
            <div className='col-xs-2 dass-link'>{this.renderMyFilesLink()}</div>
            <div className='col-xs-2 dass-link'>{this.renderCreateBucketLink()}</div>
            <div className='col-xs-2 dass-link'>{this.renderToolsLink()}</div>
          </div>
          <div className='row'>
            <div className='col-xs-12'><hr/></div>
          </div>
          <div className='row'>
            <div className='col-xs-12 dass-folder'>{this.renderBuckets()}</div>
            <div className='col-xs-12'>{this.renderCreateBucket()}</div>
            <div className='col-xs-12'>{this.renderTools()}</div>
            <div className='col-xs-6 text-left'>{this.renderBucketDropdown()}</div>
            <div className='col-xs-6 text-right'>{this.renderUploadButton()}</div>
          </div>
          <div className='row'>
            <div className='collapse' id='dropZone'>
              <br/>
              <div className='col-xs-12'>{this.renderDropZone()}</div>
            </div>
            <div className='col-xs-12 dass-file'><br/>{this.renderFiles()}</div>
          </div>
          <div className='row'>
            <div className='col-xs-12'>{this.renderDownloadProgress()}</div>
            <div className='col-xs-12'>{this.renderDownloadFailed()}</div>
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

function CreateBucketLink(props) {
  return (
    <a href='#' onClick={props.onClick}><span className='glyphicon glyphicon-folder-open'></span>&nbsp;&nbsp;New Bucket</a>
  );
}

function ToolsLink(props) {
  return (
    <a href='#' onClick={props.onClick}>&nbsp;&nbsp;<span className='glyphicon glyphicon-cog'></span>&nbsp;Tools</a>
  );
}

function BucketDropdown(props) {
  const buckets = props.buckets;
  const listItems = buckets.map((bucket) =>
    <li key={bucket.id}><a href='#' onClick={props.onClick} id={bucket.id} name={bucket.name}>{bucket.name}</a></li>
  );
  return (
    <div className='btn-group'>
      <button type='button' className='btn btn-primary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
        {props.bucket}&nbsp;<span className='caret'></span>
      </button>
      <ul className='dropdown-menu'>
        {listItems}
      </ul>
    </div>
  );
}

function UploadButton(props) {
  return (
    <div>
      <button className='btn btn-upload' type='button' data-toggle='collapse' data-target='#dropZone' aria-expanded='false' aria-controls='dropZone'>
        <span className='glyphicon glyphicon-cloud-upload'></span>&nbsp;Upload
      </button>
    </div>
  );
}

function DownloadProgress(props) {
  return (
    <Modal show={props.downloadInprogress}>
      <Modal.Header>
        <Modal.Title>Retrieving File From Storj Network</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ProgressBar now={props.downloadPercent} min={0} max={100} bsStyle='info' label={`${props.downloadPercent}%`}/>
      </Modal.Body>
      <Modal.Footer>
        {/* <button className='btn btn-upload' type='button' onClick={props.onClick}>Cancel</button> */}
      </Modal.Footer>
    </Modal>
  );
}

function DownloadFailed(props) {
  return (
    <Modal show={props.downloadFailed}>
      <Modal.Header>
        <Modal.Title>Download Failed!</Modal.Title>
      </Modal.Header>
      <Modal.Body>Error: {props.downloadMessage}.</Modal.Body>
      <Modal.Footer>
        <button className='btn btn-upload' type='button' onClick={props.onClick}>Clear</button>
      </Modal.Footer>
    </Modal>
  );
}

export {Main};
