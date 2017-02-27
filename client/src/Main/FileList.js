import React, {Component} from 'react';
import Griddle from 'griddle-react';
import '../css/Griddle.css';

class FileList extends Component {

  render() {

    var FileNameComponent = React.createClass({
      render: function(){
        return <a href='#'><i className="fa fa-file-o fa-1x"></i>&nbsp;{this.props.data}</a>
      }
    });

    var colStyle = [
      {
        "columnName": "filename",
        "order": 1,
        "locked": false,
        "visible": true,
        "displayName": "File",
        "customComponent": FileNameComponent
      },
      {
        "columnName": "size",
        "order": 2,
        "locked": false,
        "visible": true,
        "displayName": "Size"
      },
      {
        "columnName": "id",
        "order": 3,
        "locked": false,
        "visible": true,
        "displayName": "Id"
      },
      {
        "columnName": "mimetype",
        "order": 4,
        "locked": false,
        "visible": false,
        "displayName": "Mime Type"
      }
    ];


    return (

      <Griddle
        results={this.props.filelist}
        showFilter={false}
        columnMetadata={colStyle}
        noDataMessage={'There are no files in this Bucket!'}
        showSettings={false}
        columns={['filename', 'size', 'id']}
        resultsPerPage={5}
        useGriddleStyles={false}
        useFixedHeader={true}
        initialSort={'filename'}
        enableInfiniteScroll={true}
        bodyHeight={500}
        onRowClick={this.props.onClick}
      />

    );

  }

}

export {FileList};
