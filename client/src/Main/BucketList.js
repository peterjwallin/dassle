import React, {Component} from 'react';
import Griddle from 'griddle-react';
import '../css/Griddle.css';

class BucketList extends Component {

  render() {

    console.log('Rendering BucketList');

    var NameComponent = React.createClass({
      render: function(){
        return <a href='#'><i className="fa fa-folder fa-2x"></i>&nbsp;{this.props.data}</a>
      }
    });

    var DateComponent = React.createClass({
      render: function(){
        return <div>{this.props.data.substring(0,10)}</div>
      }
    });

    var colStyle = [
      {
        "columnName": "name",
        "order": 1,
        "locked": false,
        "visible": true,
        "displayName": "Bucket",
        "customComponent": NameComponent
      },
      {
        "columnName": "created",
        "order": 2,
        "locked": false,
        "visible": true,
        "displayName": "Creation Date",
        "customComponent": DateComponent
      },
      {
        "columnName": "id",
        "order": 3,
        "locked": false,
        "visible": false,
        "displayName": "Id"
      }
    ];

    return (

      <Griddle
        results={this.props.buckets}
        showFilter={false}
        columnMetadata={colStyle}
        enableInfiniteScroll={true}
        bodyHeight={600}
        showSettings={false}
        columns={['name', 'created', 'id']}
        resultsPerPage={9}
        useGriddleStyles={false}
        useFixedHeader={true}
        noDataMessage={'You need to create a Bucket. Click on the Create Bucket link.'}
        initialSort={'name'}
        onRowClick={this.props.onClick}
      />

    );

  }

}

export {BucketList};
