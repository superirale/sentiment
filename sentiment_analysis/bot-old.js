'use strict';

if(process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}


// dependencies
const
  Twit = require('twit'),
  Sentiment = require('sentiment'),
  colors = require('colors/safe'),
  rateLimit = require('function-rate-limit'),
  emailer = require('./emailer');

// variables
const
  {
    C_KEY,
    C_SECRET,
    A_TOKEN,
    A_SECRET
  } = process.env,
  T_OPTIONS = {
    consumer_key: C_KEY,
    consumer_secret: C_SECRET,
    access_token: A_TOKEN,
    access_token_secret: A_SECRET,
    timeout_ms: 60 * 1000
  };

// instantiate Twit and sentiment
const
  T = new Twit(T_OPTIONS),
  sentiment = new Sentiment();

let
  KWORD = 'nigeria',
  TWEET_COUNT = 20,
  tweet_counter = 1,
  pos_tweets = [],
  neg_tweets = [],
  neut_tweets = [],
  tweets_per_cycle = 50,
  cycle_interval = 1000;

let extraEmails;

if (process.argv.length >= 3) {
  KWORD = process.argv[2];
  TWEET_COUNT = (process.argv[4])? process.argv[4]: TWEET_COUNT;
  extraEmails = process.argv.slice(3).join(', ');
}

// cr8 a stream of tweets
const T_STREAM = T.stream('statuses/filter', { track: [`${KWORD}`]});


function getTweetStream (TWEET_COUNT) {
  // handle streaming events
  T_STREAM.on('tweet', tweet => {

    console.log(`tweet_counter: ${tweet_counter}`);

    if (tweet_counter == TWEET_COUNT) {

      T_STREAM.stop();

      let resultObj = {
        pos: pos_tweets,
        neg: neg_tweets,
        neut: neut_tweets
      };

      console.log(JSON.stringify(resultObj));

      // return emailer({
      //   pos: pos_tweets,
      //   neg: neg_tweets,
      //   neut: neut_tweets,
      //   kword: KWORD,
      //   extraEmails
      // });
    }
    if(!!tweet['retweeted_status']) {
      if(!!tweet['retweeted_status']['extended_tweet']) {
        const msg = tweet['retweeted_status']['extended_tweet']['full_text'].replace(/(\r\n\t|\n|\r\t)/gm,"").trim();
        const SCORE = sentiment.analyze(msg).comparative;
        let OUTPUT;
        if(SCORE > 0) {
          OUTPUT = colors.green(msg);
          pos_tweets.push({
            date: tweet['created_at'],
            handle: tweet.user['screen_name'],
            location: tweet.user.location,
            msg
          });
        }
        if(SCORE < 0) {
          OUTPUT = colors.red(msg);
          neg_tweets.push({
            date: tweet['created_at'],
            handle: tweet.user['screen_name'],
            location: tweet.user.location,
            msg
          });
        }
        if(SCORE === 0) {
          OUTPUT = colors.blue(msg);
          neut_tweets.push({
            date: tweet['created_at'],
            handle: tweet.user['screen_name'],
            location: tweet.user.location,
            msg
          });
        }
        console.log(OUTPUT);
        tweet_counter++;
      }
      else {
        const msg = tweet['retweeted_status'].text.replace(/(\r\n\t|\n|\r\t)/gm,"").trim();
        const SCORE = sentiment.analyze(msg).comparative;
        let OUTPUT;
        if(SCORE > 0) {
          OUTPUT = colors.green(msg);
          pos_tweets.push({
            date: tweet['created_at'],
            handle: tweet.user['screen_name'],
            location: tweet.user.location,
            msg
          });
        }
        if(SCORE < 0) {
          OUTPUT = colors.red(msg);
          neg_tweets.push({
            date: tweet['created_at'],
            handle: tweet.user['screen_name'],
            location: tweet.user.location,
            msg
          });
        }
        if(SCORE === 0) {
          OUTPUT = colors.blue(msg);
          neut_tweets.push({
            date: tweet['created_at'],
            handle: tweet.user['screen_name'],
            location: tweet.user.location,
            msg
          });
        }
        console.log(OUTPUT);
        tweet_counter++;
      }
    }
    if(!!tweet['extended_tweet']) {
      const msg = tweet['extended_tweet']['full_text'].replace(/(\r\n\t|\n|\r\t)/gm,"").trim();
      const SCORE = sentiment.analyze(msg).comparative;
      let OUTPUT;
      if(SCORE > 0) {
        OUTPUT = colors.green(msg);
        pos_tweets.push({
          date: tweet['created_at'],
          handle: tweet.user['screen_name'],
          location: tweet.user.location,
          msg
        });
      }
      if(SCORE < 0) {
        OUTPUT = colors.red(msg);
        neg_tweets.push({
          date: tweet['created_at'],
          handle: tweet.user['screen_name'],
          location: tweet.user.location,
          msg
        });
      }
      if(SCORE === 0) {
        OUTPUT = colors.blue(msg);
        neut_tweets.push({
          date: tweet['created_at'],
          handle: tweet.user['screen_name'],
          location: tweet.user.location,
          msg
        });
      }
      console.log(OUTPUT);
      tweet_counter++;
    }
    if((!tweet['extended_tweet']) && (!tweet['retweeted_status'])) {
      const msg = tweet.text.replace(/(\r\n\t|\n|\r\t)/gm,"").trim();
      const SCORE = sentiment.analyze(msg).comparative;
      let OUTPUT;
      if(SCORE > 0) {
        OUTPUT = colors.green(msg);
        pos_tweets.push({
          date: tweet['created_at'],
          handle: tweet.user['screen_name'],
          location: tweet.user.location,
          msg
        });
      }
      if(SCORE < 0) {
        OUTPUT = colors.red(msg);
        neg_tweets.push({
          date: tweet['created_at'],
          handle: tweet.user['screen_name'],
          location: tweet.user.location,
          msg
        });
      }
      if(SCORE === 0) {
        OUTPUT = colors.blue(msg);
        neut_tweets.push({
          date: tweet['created_at'],
          handle: tweet.user['screen_name'],
          location: tweet.user.location,
          msg
        });
      }
      console.log(OUTPUT);
      tweet_counter++;
    }
  });
}

let fn = rateLimit(1, cycle_interval, function (x) {
  getTweetStream (x)
});

if (TWEET_COUNT > tweets_per_cycle) {
  let count_cycle = Math.ceil(TWEET_COUNT / tweets_per_cycle);

  for (var i = 0; i < count_cycle; i++) {
    console.log("circle: "+ i)
    fn(50);
  }

}
else {
  getTweetStream(TWEET_COUNT)
}