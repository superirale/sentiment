'use strict';
/**
 * Module Dependencies
 */
//=============================================================================
const
  ConversationV1 = require('watson-developer-cloud/conversation/v1');
//=============================================================================
/**
 * Module variables
 */
//=============================================================================
const
  USERNAME = process.env.SERVICE_USERNAME,
  PASSWORD = process.env.SERVICE_PASSWORD,
  WORKSPACE_ID = process.env.WORKSPACE_ID,
  VERSION_DATE = process.env.VERSION_DATE;

let chatContext
//=============================================================================
/**
 * Config
 */
//=============================================================================
const ChatBot = new ConversationV1({
  username: USERNAME,
  password: PASSWORD,
  version_date: VERSION_DATE
})
//=============================================================================
/**
 * Export Module
 */
//=============================================================================
module.exports = async function (data) {
  let userInput;
  if (!data) {
    userInput = {
      workspace_id: WORKSPACE_ID
    }
  } else {
    userInput = {
      workspace_id: WORKSPACE_ID,
      input: {
        text: data.trim()
      },
    }
    if (chatContext) {
      userInput.context = chatContext
    }
  }

  return new Promise((resolve, reject) => {
    ChatBot.message(userInput, (err, response) => {
      if (err) {
        console.log('There was an error while sending the message to service')
        console.error(err)
        reject('There was a problem talking to the bot')
      }

      if (response.intents.length > 0) {
        console.log(`Detected intent: #${response.intents[0].intent}`)
      }

      if (response.output.text.length != 0) {
        chatContext = response.context
        resolve(response.output.text)
      }
    })
  })
}
//=============================================================================