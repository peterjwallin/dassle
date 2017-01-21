import React, {Component} from 'react';
import {UserStatus, Logout} from './Client';
import {Welcome} from './Welcome';
import {Auth} from './Auth';
import './App.css';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {
      isLoggedIn: false,
      showWelcome: true,
      showLogin: false
    };
  }

  componentWillMount() {
    UserStatus('', (result) => {
      if (result.isLoggedIn) {
        this.setState({isLoggedIn: true});
        this.setState({showWelcome: false});
        this.setState({showLogin: false});
      }
    });
  }

  handleLoginClick() {
    this.setState({showWelcome: false});
    this.setState({showLogin: true});
  }

  handleLogoutClick() {
    Logout('', (result) => {
      if (result.isLoggedOut) {
        this.setState({isLoggedIn: false});
        this.setState({showWelcome: true});
        this.setState({showLogin: false});
      }
    });
  }

  renderLoginButton() {
    return this.state.isLoggedIn? <LogoutButton onClick={this.handleLogoutClick} /> : <LoginButton onClick={this.handleLoginClick} />;
  }

  renderWelcomePage() {
    return this.state.showWelcome? <Welcome onClick={this.handleLoginClick} /> : null;
  }

  renderLoginPage() {
    return this.state.showLogin? <Auth /> : null;
  }

  render() {

    return (
      <div>
        <nav className="navbar navbar-default navbar-static-top">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">
              <img src="/logo.png" className="App-logo" alt="Dassle"/>
            </a>
          </div>
          <div className="container">
            <ul className="nav navbar-nav navbar-right">
              <li className="navbar-left">
                  <a className="a-home" href="#"><span className="glyphicon glyphicon-home"></span> Home</a>
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
        {this.renderWelcomePage()}
        {this.renderLoginPage()}
      </div>
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
