import React from 'react'

export default function ChatBubble(props) {
  return (
    <div className={props.category === 'received' ? "message-received" : "message-sent"}>
      <div className="bubble">{props.message}</div>
      <div className="timestamp">
        <div className="time">{props.time}</div>
      </div>
    </div>
  )
}