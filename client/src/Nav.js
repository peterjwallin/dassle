import React, {Component} from 'react';

class Nav extends Component {

  renderLoginButton() {
    return this.props.isLoggedIn? <LogoutButton onClick={this.props.Logout} /> : <LoginButton onClick={this.props.Login} />;
  }

  render() {

      return (

        <nav className="navbar navbar-default navbar-static-top">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">
              <img src="/logo.png" className="App-logo" alt="Dassle"/>
            </a>
          </div>
          <div className="container">
            <ul className="nav navbar-nav navbar-right">
              <li className="navbar-left">
                  <a className="a-home" href="/"><span className="glyphicon glyphicon-home"></span> Home</a>
              </li>
              <li className="navbar-left">
                  <a className="a-about" href="#"><span className="glyphicon glyphicon-user"></span> About</a>
              </li>
              <li className="navbar-right">
                {this.renderLoginButton()}
              </li>
            </ul>
          </div>
        </nav>

      );

  }

}

function LoginButton(props) {
  return (
    <a className="a-login" href="#" onClick={props.onClick}><span className="glyphicon glyphicon-log-in"></span> Login</a>
  );
}

function LogoutButton(props) {
  return (
    <a className="a-logout" href="#" onClick={props.onClick}><span className="glyphicon glyphicon-log-out"></span> Logout</a>
  );
}

export {Nav};
