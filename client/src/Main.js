import React, {Component} from 'react';

class Main extends Component {

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
                </div>
              </div>
            </div>
          </div>

      );

  }

}

export {Main};
