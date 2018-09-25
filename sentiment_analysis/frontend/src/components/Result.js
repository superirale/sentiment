import React, { Component } from 'react';
// import '../styles/Result.css';
import  'bootstrap3/dist/css/bootstrap.min.css';


class Result extends Component {

  constructor (props) {
    super(props)
    this.state = {
      result: {}
    }
  }


  componentDidMount() {
    this.setState({result: this.props.result})
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <table className="table table-strip">
              <tr>
                <td> Total no. of positive tweets: </td> <td> {this.state.pos.length} </td>
              </tr>
              <tr>
                <td> Total no. of negative tweets: </td> <td> {this.state.neg.length} </td>
              </tr>
              <tr>
                <td> Total no. of neutral tweets: </td> <td> {this.state.neu.length} </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Result;