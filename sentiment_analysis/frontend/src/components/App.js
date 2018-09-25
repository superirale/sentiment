import React, { Component } from 'react';
import '../styles/App.css';
import  'bootstrap3/dist/css/bootstrap.min.css';
import socketIOClient from "socket.io-client";


class App extends Component {

  constructor (props) {
    super(props)
    this.tweets = [];
    this.resultSummary = {};
    this.socket = socketIOClient("http://localhost:3000");
    this.state = {
      term: '',
      tweets_count: '',
      email: '',
      botRunning: false,
      feeds: [],
      analysisPercentage: 0,
      result: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.startBot = this.startBot.bind(this);
  }


  startBot (e) {
    e.preventDefault();
    let {term, tweets_count, email} = this.state
    const data = {
      term: term,
      tweets_count: tweets_count,
      email: email
    }
    console.log(data)
    this.socket.emit('start-bot', data)
  }

  showButton () {

     if (!this.state.botRunning) {
        return (<div className="form-group">
                  <button className="btn btn-success pull-left"> Analyse </button>
              </div>)
      }
      else {
        return  (
          <div className="form-group">
            <div className="progress">
              <div className="progress-bar" role="progressbar" style={{width: this.state.analysisPercentage}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">Analysing tweets... {this.state.analysisPercentage}
              </div>
            </div>
          </div>
          )
      }
  }

  displayTweetFeed (feed) {
    if (feed.length > 0) {
      return (feed.map(function(tweet, index) {

        let cssClass = 'tweet ';

        if (tweet.type == 'positive') {
          cssClass +="pos-tweet";
        }

        if (tweet.type == 'negative') {
          cssClass +="neg-tweet";
        }

        if (tweet.type == 'neutral') {
          cssClass +="neu-tweet";
        }
        return (
          <div className={cssClass} key={index}>
            <span className="tweetText">{tweet.msg}</span>
          </div>
          )
        })
      )
    }
    return (<h1> No Activity </h1>)
  }

  handleChange (event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({[name]: value });
  }

  componentDidMount() {
    this.socket.on('bot-started', (data) => {
      if(data.status === true) {
        this.setState({botRunning: true});
        this.setState({feeds: []});
      }
    })

    this.socket.on('response', (data) => {
      if(typeof data === 'object') {
        let feeds = this.state.feeds;
        feeds.push(data);
        this.setState({feeds: feeds});
        let percentage = Math.floor((this.state.feeds.length / this.state.tweets_count) * 100) + "%";
        this.setState({analysisPercentage: percentage});
      }

      if(this.state.feeds.length === Number(this.state.tweets_count)) {
        this.setState({botRunning: false})
        this.setState({analysisPercentage: "0%"})
      }

      console.log(data)
    })
    this.socket.on('result', (data) => {
      if (Object.getOwnPropertyNames(data).length > 0) {
        console.log(data)
        this.setState({result: data})
      }
    })
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#">Sentiment Analysis</a>
            </div>
            <div id="navbar" className="collapse navbar-collapse">
            </div>
          </div>
        </nav>
        <div className="App container">
          <div className="row">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <form className="form-horizontal analysis-form" onSubmit={this.startBot}>
                    <div className="form-group">
                      <input type="text" name="term" placeholder="Term e.g #hashtag, topic etc" className="form-control" value={this.state.term} onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                      <input type="text" name="tweets_count" className="form-control" value={this.state.tweets_count} onChange={this.handleChange} placeholder="Tweets count" />
                    </div>
                    <div className="form-group">
                        <input type="email" name="email" className="form-control" value={this.state.email} onChange={this.handleChange} placeholder="email" />
                    </div>
                    {this.showButton()}
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tweets-container">
                {this.displayTweetFeed(this.state.feeds)}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default App;