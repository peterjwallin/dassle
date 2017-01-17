
import React from 'react';
import Client from './Client';

const Auth = React.createClass({
  getInitialState: function () {
    return {
      buckets: [],
      isLoggedIn: false,
      passPhrase: '',
    };
  },
  handleAuthentication: function (e) {
    const value = e.target.value;

    this.setState({passPhrase: value});

    if (value === '') {
      this.setState({
        buckets: [],
        isLoggedIn: false,
      });
    } else {
      Client.authenticate(value, (result) => {
        this.setState({
          isLoggedIn: result.isLoggedIn,
        });
      });
    }
  },
  render: function () {
    return (
      <div>
        <input className='prompt' type='text' placeholder='Enter 12 word passphrase' value={this.state.passPhrase} onChange={this.handleAuthentication}/>
        <button>Submit</button>
      </div>
    );
  },
});

export default Auth;
