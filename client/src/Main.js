import React, {Component} from 'react';
import {BucketList} from './Main/BucketList';
import {FileList} from './Main/FileList';
import {Dropzone} from './Main/Dropzone';
import {Buckets} from './Client';
import {Files} from './Client';
import {Download} from './Client';

class Main extends Component {

  constructor(props) {
    super(props);
    this.handleShowBucketsClick = this.handleShowBucketsClick.bind(this);
    this.handleShowMyFilesClick = this.handleShowMyFilesClick.bind(this);
    this.handleUploadClick = this.handleUploadClick.bind(this);
    this.handleCreateBucketClick = this.handleCreateBucketClick.bind(this);
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
    this.handleShowMyFiles = this.handleShowMyFiles.bind(this);
    this.handleBucketDropdownClick = this.handleBucketDropdownClick.bind(this);
    this.state = {
      showSubNav: false,
      showBuckets: false,
      myFiles: false,
      upload: false,
      createBucket: false,
      isBuckets: false,
      buckets: [],
      bucketID: null,
      bucketName: null,
      isFiles: false,
      files: [],
      downloadFailed: false,
      isRedirected: false

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
        isBuckets: isBuckets,
        buckets: buckets
      });
    });
  }

  //Click Functions
  handleShowBucketsClick() {
    this.setState({
      showBuckets:true,
      myFiles:false,
      upload:false,
      createBucket:false
    });
  }

  handleShowMyFilesClick(row) {
    Files(row.props.data.id, (result) => {
      this.setState({
        files: result.files,
        isFiles: result.isFiles,
        bucketID:row.props.data.id,
        bucketName:row.props.data.name,
        showBuckets:false,
        myFiles:true
      });
    });
  }

  handleBucketDropdownClick(event) {
    const bucketid = event.target.id;
    const bucketname = event.target.name;
    Files(bucketid, (result) => {
      this.setState({
        files: result.files,
        isFiles: result.isFiles,
        bucketID:bucketid,
        bucketName:bucketname,
        showBuckets:false,
        myFiles:true
      });
    });
  }

  handleShowMyFiles() {
    Files(this.state.bucketID, (result) => {
      this.setState({
        files: result.files,
        isFiles: result.isFiles
      });
    });
  }

  handleUploadClick() {
    this.setState({
      showBuckets:false,
      myFiles:false,
      upload:true,
      createBucket:false
    });
  }

  handleCreateBucketClick() {
    this.setState({
      showBuckets:false,
      myFiles:false,
      upload:false,
      createBucket:true
    });
  }

  handleDownloadClick(row) {

    var downloadFailed = true;

    Download(row.props.data.id, row.props.data.filename, (result) => {

      const data = result;
      const fileName = row.props.data.filename;

      var saveData = (function () {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function (data, fileName) {
          var blob = new Blob([data]),
              url = window.URL.createObjectURL(blob);
          a.href = url;
          a.download = fileName;
          a.click();
          window.URL.revokeObjectURL(url);
        };
      }());

      if (data) {
        downloadFailed = false;
        saveData(data, fileName);
      }

    });

    if (downloadFailed) {
      this.setState({downloadFailed:true});
    }

  }

  // Render Components
  renderMyFilesLink() {
    return this.state.showSubNav? <MyFilesLink onClick={this.handleShowBucketsClick} /> : null;
  }

  renderUploadLink() {
    return this.state.showSubNav? <UploadLink onClick={this.handleUploadClick} /> : null;
  }

  renderCreateBucketLink() {
    return this.state.showSubNav? <CreateBucketLink onClick={this.handleCreateBucketClick} /> : null;
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

  renderUpload() {
    return this.state.upload? <h1>Upload File</h1> : null;
  }

  renderCreateBucket() {
    return this.state.createBucket? <h1>CreateBucket</h1> : null;
  }

  render() {

      return (

        <div className='container'>
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
            <div className='col-xs-12'>{this.renderUpload()}</div>
            <div className='col-xs-12'>{this.renderCreateBucket()}</div>
            <div className='col-xs-6 text-left'>{this.renderBucketDropdown()}</div>
            <div className='col-xs-6 text-right'>{this.renderUploadButton()}</div>
          </div>
          <div className='row'>
            <div className="collapse" id="dropZone">
              <br/>
              <div className='col-xs-12'>{this.renderDropZone()}</div>
            </div>
            <div className='col-xs-12 dass-file'><br/>{this.renderFiles()}</div>
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

function BucketDropdown(props) {

  const buckets = props.buckets;
  const listItems = buckets.map((bucket) =>
    <li key={bucket.id}><a href='#' onClick={props.onClick} id={bucket.id} name={bucket.name}>{bucket.name}</a></li>
  );

  return (

    <div className="btn-group">
      <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {props.bucket}&nbsp;<span className="caret"></span>
      </button>
      <ul className="dropdown-menu">
        {listItems}
      </ul>
    </div>

  );
}

function UploadButton(props) {

  return (

    <div>
      <button className="btn btn-upload" type="button" data-toggle="collapse" data-target="#dropZone" aria-expanded="false" aria-controls="dropZone">
        <span className='glyphicon glyphicon-cloud-upload'></span>&nbsp;Upload
      </button>
    </div>

  );
}

export {Main};
