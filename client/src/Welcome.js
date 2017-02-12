import React, {Component} from 'react';

class Welcome extends Component {

  render() {

      return (

          <div className="container">

            <div className="row welcome">
              <div className="col-xs-12 text-center">
                  <img className="welcome-logo" src="welcome.png" alt="Welcome"/>
              </div>
            </div>

            <div className="row welcome">
              <div className="col-xs-12 text-center">
                  <button className="btn-show-login btn btn-lg btn-primary" onClick={this.props.onClick}>Get Started</button>
              </div>
            </div>

          </div>

      );

  }

}

export {Welcome};
