import React, {Component} from 'react';
import {UserStatus} from './Client';
import Auth from './Auth';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appState: 'loggedOut',
      test: 'not updated'
    };
  }

  componentWillMount() {

    this.setState({test: 'updated'});

    UserStatus('', (result) => {
      if (result.isLoggedIn) {
        this.setState({appState: 'loggedIn'});
      }
    });

  }

  render() {

    return (
      <div>

        <nav className="navbar navbar-default navbar-static-top">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">
              <img src="logo.png" className="App-logo" alt="Dassle"/>
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
                {/*authlink*/}
              </li>
            </ul>
          </div>
        </nav>

        <Auth/>

        <h1>Goodbye - {this.state.test}</h1>

      </div>
    );

  }

}

export default App;
