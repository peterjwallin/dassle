import React from 'react';
import Auth from './Auth';

const App = React.createClass({
  getInitialState: function () {
    return {
      buckets: [],
    };
  },
  render: function () {
    return (
      <div>
        <div>
          <Auth/>
        </div>
      </div>
    );
  },
});

export default App;
