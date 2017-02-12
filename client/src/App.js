import React, {Component} from 'react';
import {UserStatus, Authenticate, Logout} from './Client';
import {Nav} from './Nav';
import {Welcome} from './Welcome';
import {Auth} from './Auth';
import {Main} from './Main';
import './css/App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.handleAuthClick = this.handleAuthClick.bind(this);
    this.state = {
      isLoggedIn: false,
      loginAttempt: false,
      showWelcome: true,
      showLogin: false,
      showMain: false
    };
  }

  componentWillMount() {
    UserStatus('', (result) => {
      if (result.isLoggedIn) {
        this.setState({
          isLoggedIn: true,
          loginAttempt: false,
          showWelcome: false,
          showLogin: false,
          showMain: true
        });
      }
    });
  }

  handleLoginClick() {
    this.setState({
      loginAttempt: false,
      showWelcome: false,
      showLogin: true
    });
  }

  handleLogoutClick() {
    Logout('', (result) => {
      if (result.isLoggedOut) {
        this.setState({
          isLoggedIn: false,
          loginAttempt: false,
          showWelcome: true,
          showLogin: false,
          showMain: false
        });
      }
    });
  }

  handleAuthClick(value) {
    Authenticate(value, (result) => {
      var loginAttempt = false;
      if (!result.isLoggedIn) {
        loginAttempt = true;
      }
      this.setState({
        isLoggedIn: result.isLoggedIn,
        loginAttempt: loginAttempt,
        showLogin: loginAttempt,
        showMain: result.isLoggedIn
      });
    });
  }

  renderNavbar() {
    return <Nav isLoggedIn={this.state.isLoggedIn} Logout={this.handleLogoutClick} Login={this.handleLoginClick}/>;
  }

  renderWelcomePage() {
    return this.state.showWelcome? <Welcome onClick={this.handleLoginClick} /> : null;
  }

  renderLoginPage() {
    return this.state.showLogin? <Auth onClick={this.handleAuthClick} loginAttempt={this.state.loginAttempt}/> : null;
  }

  renderMainPage() {
    return this.state.showMain? <Main/> : null;
  }

  render() {

    console.log('Rendering App');

    return (
      <div>
        {this.renderNavbar()}
        {this.renderWelcomePage()}
        {this.renderLoginPage()}
        {this.renderMainPage()}
      </div>
    );

  }

}

export default App;
