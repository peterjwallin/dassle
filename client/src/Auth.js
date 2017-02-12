import React, {Component} from 'react';

class Auth extends Component {

  constructor(props) {
    super(props);
    this.state = {
      passPhrase: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({passPhrase: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onClick(this.state.passPhrase);
  }

  renderLoginError() {
    return this.props.loginAttempt? <LoginError /> : null;
  }

  render () {

    console.log('Rendering Auth');

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
                    <button className="btn-login btn btn-lg btn-primary">Login</button>
                  </form>
                </div>
              </div>
          </div>
        </div>

        {this.renderLoginError()}

      </div>

    );

  }

}

function LoginError(props) {
  return (
    <div className="row login-result">
      <strong>
        <div className="col-xs-12 text-center alert alert-danger" role="alert">Error! Passphrase is not valid.</div>
      </strong>
    </div>
  );
}


export {Auth};
