"use strict";

const AWS = require('aws-sdk'),
      queueUrl = "https://sqs.us-east-1.amazonaws.com/071062764407/sentiment.fifo";

let aws_config =  {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    region: process.env.AWS_REGION
};

AWS.config.update(aws_config);
let sqs = new AWS.SQS();

let sqsHelper = {
  send: function (message) {

    let params = {
        MessageBody: "hello world",
        QueueUrl: queueUrl,
        DelaySeconds: 0
    };

    sqs.sendMessage(params, function(err, data) {
      if(err) return err;

      return data;
    });
  },

  receiver: function () {
    let params = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      VisibilityTimeout: 60 // 1 min wait time for anyone else to process.
    };

    sqs.receiveMessage(params, function(err, data) {
      if(err) return err;
      return data;
    });
  },

  delete: function (message) {
    sqs.deleteMessage({
      QueueUrl: queueUrl,
      ReceiptHandle: message.ReceiptHandle
    }, function(err, data) {
      // If we errored, tell us that we did
      err && console.log(err);
   });
  }
}

module.exports = sqsHelper;