import React, {Component} from 'react';
import Griddle from 'griddle-react';
import {Buckets} from './Client';

class Main extends Component {

  constructor(props) {
    super(props);
    this.handleShowBucketsClick = this.handleShowBucketsClick.bind(this);
    this.handleShowFilesClick = this.handleShowFilesClick.bind(this);
    this.handleUploadClick = this.handleUploadClick.bind(this);
    this.handleCreateBucketClick = this.handleCreateBucketClick.bind(this);
    this.state = {
      showBuckets: true,
      myFiles: false,
      upload: false,
      createBucket: false,
      isBuckets: true,
      buckets: []
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

  handleShowBucketsClick() {
    this.setState({showBuckets:true});
    this.setState({myFiles:false});
    this.setState({upload:false});
    this.setState({createBucket:false});
  }

  handleShowFilesClick() {
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

  renderMyFilesLink() {
    return <MyFilesLink onClick={this.handleShowBucketsClick} />
  }

/*
  renderBucketLink() {
    return <BucketLink onClick={this.handleShowFilesClick} />
  }
*/

  renderUploadLink() {
    return <UploadLink onClick={this.handleUploadClick} />
  }

  renderCreateBucketLink() {
    return <CreateBucketLink onClick={this.handleCreateBucketClick} />
  }

  renderBuckets() {

    var CardComponent = React.createClass({
      getDefaultProps: function(){
        return { 'data': {} };
      },
      render: function(){
        return (
                <div className='custom-row-card'>
                  <div><BucketLink onClick={this.handleShowFilesClick} /></div>
                  <div><strong>{this.props.data.name}</strong><small></small></div>
                  <div className='creation-date'>{this.props.data.created.substring(0,10)}</div>
                  <br/>
                </div>
              );
      }
    });

    return this.state.showBuckets? <Griddle results={this.state.buckets} showFilter={false} useCustomRowComponent={true}
                                  customRowComponent={CardComponent} showSettings={false} columns={['name', 'created']}
                                  useGriddleStyles={false} noDataMessage={null} initialSort={'name'}/> : null
  }

  renderMyFiles() {
    return this.state.myFiles? <h1>My Files</h1> : null
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
            <div className='row'>
              <div className='col-xs-12'>
                <div className='container dass'>
                  <br/>
                  <div className='row'>
                      <div className='col-xs-2'>{this.renderMyFilesLink()}</div>
                      <div className='col-xs-2'>{this.renderUploadLink()}</div>
                      <div className='col-xs-2'>{this.renderCreateBucketLink()}</div>
                  </div>
                  <div className='row'>
                    <div className='col-xs-12'><hr/></div>
                  </div>
                </div>
                <div className='container folder'>
                  <div className='row'>
                    <div className='col-xs-12'>{this.renderBuckets()}</div>
                    <div className='col-xs-12'>{this.renderMyFiles()}</div>
                    <div className='col-xs-12'>{this.renderUpload()}</div>
                    <div className='col-xs-12'>{this.renderCreateBucket()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

      );

  }

}

function MyFilesLink(props) {
  return (
    <a className='a-myfiles' href='#' onClick={props.onClick}><span className='glyphicon glyphicon-file'></span>&nbsp;My Files</a>
  );
}

function BucketLink(props) {
  return (
    <a className='folder' href='#' onClick={props.onClick}><i className="fa fa-folder fa-5x"></i></a>
  );
}

function UploadLink(props) {
  return (
    <a className='a-upload' href='#' onClick={props.onClick}><span className='glyphicon glyphicon-cloud-upload'></span>&nbsp;Upload</a>
  );
}

function CreateBucketLink(props) {
  return (
    <a className='a-createbucket' href='#' onClick={props.onClick}><span className='glyphicon glyphicon-folder-open'></span>&nbsp;&nbsp;Create Bucket</a>
  );
}

export {Main};
