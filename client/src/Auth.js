
import React, {Component} from 'react';
import {Authenticate} from './Client';

class Auth extends Component {

  constructor(props) {
    super(props);
    this.state = {
      passPhrase: '',
      isLoggedIn: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({passPhrase: event.target.value});
  }

  handleSubmit(event) {
    event.defaultPrevented();
    Authenticate(this.state.passPhrase, (result) => {
      this.setState({isLoggedIn: result.isLoggedIn});
      if (this.state.isLoggedIn) {
        ;
      }
    });
  }

  render () {

    return (

      <div className="container">

        <div className="row login">
          <div className="col-xs-12 text-center">
            <br />
            <br />
            <div className="panel panel-default panel-dass">
              <div className="panel-heading text-left panel-heading-dass"><strong>Passphrase</strong></div>
                <div className="panel-body">
                  <br />
                  <form onSubmit={this.handleSubmit}>
                    <input className="input-login" type="text" placeholder="Enter Your 12 Word Passphrase" value={this.state.passPhrase} onChange={this.handleChange}/>
                    <br />
                    <button className="btn-login btn btn-lg btn-primary btn-dass">Login</button>
                  </form>
                </div>
              </div>
          </div>
        </div>

      </div>

    );

  }

}

export {Auth};
