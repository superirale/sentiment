import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'

import './App.css'
import { ChatBubble } from './components'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      messages: [],
      waiting: false
    }

    this.handleTextChange = this.handleTextChange.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
  }

  handleTextChange(e) {
    this.setState({ message: e.target.value })
  }

  processApiResponse(apiResponse) {
    let botResponse = apiResponse.data.responseFromBot
    let oldMessages = this.state.messages
    let newMessages = []
    botResponse.forEach(response => {
      newMessages = [...newMessages, <ChatBubble {...this.createChatBubbleProps('received', response)}/>]
    });
    this.setState(prevState => ({
      messages: [...oldMessages, newMessages],
      waiting: false
    }))
    this.messagesEnd.scrollIntoView({ behavior: "smooth" })
  }

  async sendMessage(e) {
    e.preventDefault()
    if (!this.state.message || this.state.waiting) {
      return
    }

    let input = this.state.message

    this.setState(prevState => ({
      messages: [...prevState.messages, <ChatBubble {...this.createChatBubbleProps('sent', this.state.message)}/>],
      message: '',
      waiting: true
    }))

    try {
      let apiResponse = await axios.post('/send_message', { input })
      this.processApiResponse(apiResponse)
    } catch (error) {
      let errorResponse = error.response.data
      console.error(errorResponse.message)
    }
  }

  createChatBubbleProps(category, message) {
    return {
      category,
      message,
      time: moment().format("h:mm A"),
      key: this.state.messages.length - 1
    }
  }

  async componentDidMount() {
    this.setState({waiting: true})
    try {
      let apiResponse = await axios.get('/welcome')
      this.processApiResponse(apiResponse)
    } catch (error) {
      let errorResponse = error.response.data
      console.error(errorResponse.message)
    }
  }

  render() {
    return (
      <div>
        <div className="content">
          <div className="conversation-title">
            <h1>Jane</h1>
            <p className="status">Your virtual banking assistant</p>
          </div>
          <div className="conversation-wrapper">
            {this.state.messages}
            <div style={{ float:"left", clear: "both" }} ref={(el) => { this.messagesEnd = el; }}></div>
          </div>
          <div className="messaging-area">
            <form onSubmit={this.sendMessage}>
              <input placeholder="Your message here..." value={this.state.message} onChange={this.handleTextChange}/>
              {
                !this.state.waiting &&
                <button type="submit" className="send">
                  <i className="icon-paper-plane icons"></i>
                </button>
              }
            </form>
          </div>
        </div>
      </div>
    );
  }
}
