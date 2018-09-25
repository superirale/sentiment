"use strict";

const AWS = require('aws-sdk');

let aws_config =  {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    region: process.env.AWS_REGION
};

AWS.config.update(aws_config);
let sns = new AWS.SNS();

let snsNotifier = {
  publish: function (topic, message) {
    let params = {
      TopicArn: topic,
      MessageStructure: "json",
      Message: message
    }

    sns.publish(params, function(err, data) {
        if(err)
          return console.log(err.stack);
        return data;
    });

  }
}

module.exports = snsNotifier;