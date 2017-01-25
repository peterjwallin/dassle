import React, {Component} from 'react';
import Griddle from 'griddle-react';
import {Buckets} from './Client';

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      myFiles: true,
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

  renderBuckets() {

    var CardComponent = React.createClass({
      getDefaultProps: function(){
        return { 'data': {} };
      },
      render: function(){
        return (
                <div className='custom-row-card'>
                  <div><a className='folder' href='#'><span className='glyphicon glyphicon-folder-open'></span></a></div>
                  <div className='name'><strong>{this.props.data.name}</strong><small></small></div>
                  <div>{this.props.data.created}</div>
                  <br/>
                </div>
              );
      }
    });

    return this.state.isBuckets? <Griddle results={this.state.buckets} showFilter={false} useCustomRowComponent={true}
                                  customRowComponent={CardComponent} showSettings={false} columns={['name', 'created']}
                                  useGriddleStyles={false} noDataMessage={null}/> : <h1>No Buckets Found</h1>
  }

  renderUpload() {
    return <h1>Upload File</h1>
  }

  renderCreateBucket() {
    return <h1>CreateBucket</h1>
  }

  render() {

      return (

          <div className='container'>
            <div className='row'>
              <div className='col-xs-12'>
                <div className='container dass'>
                  <br/>
                  <div className='row'>
                      <div className='col-xs-2'>
                        <a className='a-myfiles' href='#'><span className='glyphicon glyphicon-file'></span>&nbsp;My Files</a>
                      </div>
                      <div className='col-xs-2'>
                        <a className='a-upload' href='#'><span className='glyphicon glyphicon-cloud-upload'></span>&nbsp;Upload</a>
                      </div>
                      <div className='col-xs-2'>
                        <a className='a-createbucket' href='#'><span className='glyphicon glyphicon-folder-open'></span>&nbsp;&nbsp;Create Bucket</a>
                      </div>
                  </div>
                  <div className='row'>
                    <div className='col-xs-12'><hr/></div>
                  </div>
                </div>
                <div className='container folder'>
                  <div className='row'>
                    <div className='col-xs-12'>{this.renderBuckets()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

      );

  }

}

function MyFiles(props) {
  return (
    <a className='a-myfiles' href='#' onClick={props.onClick}><span className='glyphicon glyphicon-file'></span>&nbsp;My Files</a>
  );
}

function Upload(props) {
  return (
    <a className='a-upload' href='#' onClick={props.onClick}><span className='glyphicon glyphicon-cloud-upload'></span>&nbsp;Upload</a>
  );
}

function CreateBucket(props) {
  return (
    <a className='a-createbucket' href='#'><span className='glyphicon glyphicon-folder-open'></span>&nbsp;&nbsp;Create Bucket</a>
  );
}

export {Main};
