import React, {Component} from 'react';
import {Buckets} from './Client';

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isBuckets: true,
      buckets: null
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
    return <BucketList buckets={this.state.buckets}/>;
  }

  render() {

      return (

          <div className="container">
            <div className="row">
              <div className="col-xs-12">
                <div className="container dass">
                  <br/>
                  <div className="row">
                      <div className="col-xs-2">
                        <a className="a-myfiles" href="#"><span className="glyphicon glyphicon-file"></span>&nbsp;My Files</a>
                      </div>
                      <div className="col-xs-2">
                        <a className="a-upload" href="#"><span className="glyphicon glyphicon-cloud-upload"></span>&nbsp;Upload</a>
                      </div>
                      <div className="col-xs-2">
                        <a className="a-createbucket" href="#"><span className="glyphicon glyphicon-folder-open"></span>&nbsp;&nbsp;Create Bucket</a>
                      </div>
                  </div>
                  <div className="row">
                    <div className="col-xs-12"><hr/></div>
                  </div>
                  <div className="row">
                    <div className="col-xs-12">{this.renderBuckets()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

      );

  }

}

function BucketList(props) {
  return (
    <h1>Found Buckets</h1>
  );
}

export {Main};
