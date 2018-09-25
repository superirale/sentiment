'use strict';

if(process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}


// dependencies
const
  Twit = require('twit'),
  Sentiment = require('sentiment');

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
  KWORD = 'Nigeria',
  TWEET_COUNT = 20,
  pos_tweets = [],
  neg_tweets = [],
  neut_tweets = [],
  TWEETS_PER_CYCLE = 50,
  TOTAL_TWEETS_PROCESSED = 0,
  // CYCLE_INTERVAL = 5 * 60;
  CYCLE_INTERVAL = 5 * 60;

let extraEmails;

if (process.argv.length >= 3) {
  KWORD = process.argv[2];
  TWEET_COUNT = (process.argv[4])? process.argv[4]: TWEET_COUNT;
  extraEmails = process.argv.slice(3).join(', ');
}


function getStreamTweets(cycles, counter) {

  let tweet_counter = 1;

  if( counter < cycles) {
    let startTime = process.hrtime();

    const T_STREAM = T.stream('statuses/filter', { track: [`${KWORD}`]});

    T_STREAM.on('tweet', tweet => {

    console.log(`tweet_counter: ${tweet_counter}`);

    if (tweet_counter == TWEETS_PER_CYCLE || TOTAL_TWEETS_PROCESSED == TWEET_COUNT ) {

      T_STREAM.stop();

      let executionTime = process.hrtime(startTime)[0] ;

      counter ++;

      if( cycles > 1) {

        let fn = function () { return getStreamTweets(cycles, counter) }
        if (executionTime < CYCLE_INTERVAL) {
          let remainingTime = (CYCLE_INTERVAL - executionTime) * 1000;
          return setTimeout(fn, remainingTime);
        }
        else {
          return getStreamTweets(cycles, counter)
        }
      }
    }

    if (!!tweet['retweeted_status']) {
      if (!!tweet['retweeted_status']['extended_tweet']) {
        const msg = tweet['retweeted_status']['extended_tweet']['full_text'].replace(/(\r\n\t|\n|\r\t)/gm,"").trim();
        const SCORE = sentiment.analyze(msg).comparative;

        let tweetObj = {
            date: tweet['created_at'],
            handle: tweet.user['screen_name'],
            location: tweet.user.location,
            msg
          };

        if (SCORE > 0) {
          pos_tweets.push(tweetObj);
          tweetObj.type = 'positive';
        }
        if (SCORE < 0) {
          neg_tweets.push(tweetObj);
          tweetObj.type = 'negative';
        }
        if (SCORE === 0) {
          neut_tweets.push(tweetObj);
          tweetObj.type = 'neutral';
        }
        console.log(JSON.stringify(tweetObj))
        tweet_counter++;
        TOTAL_TWEETS_PROCESSED++;
      }
      else {
        const msg = tweet['retweeted_status'].text.replace(/(\r\n\t|\n|\r\t)/gm,"").trim();
        const SCORE = sentiment.analyze(msg).comparative;
        let tweetObj = {
            date: tweet['created_at'],
            handle: tweet.user['screen_name'],
            location: tweet.user.location,
            msg
          };

        if(SCORE > 0) {
          pos_tweets.push(tweetObj);
          tweetObj.type = 'positive';
        }
        if(SCORE < 0) {
          neg_tweets.push(tweetObj);
          tweetObj.type = 'negative';
        }
        if(SCORE === 0) {
          neut_tweets.push(tweetObj);
          tweetObj.type = 'neutral';
        }
        console.log(JSON.stringify(tweetObj))
        tweet_counter++;
        TOTAL_TWEETS_PROCESSED++;
      }
    }
    if(!!tweet['extended_tweet']) {
      const msg = tweet['extended_tweet']['full_text'].replace(/(\r\n\t|\n|\r\t)/gm,"").trim();
      const SCORE = sentiment.analyze(msg).comparative;
      let tweetObj = {
          date: tweet['created_at'],
          handle: tweet.user['screen_name'],
          location: tweet.user.location,
          msg
        };
      if(SCORE > 0) {
        pos_tweets.push(tweetObj);
        tweetObj.type = 'positive';
      }
      if(SCORE < 0) {
        neg_tweets.push(tweetObj);
        tweetObj.type = 'negative';

      }
      if(SCORE === 0) {
        neut_tweets.push(tweetObj);
        tweetObj.type = 'neutral';
      }
      console.log(JSON.stringify(tweetObj))
      tweet_counter++;
      TOTAL_TWEETS_PROCESSED++;
    }

    if ((!tweet['extended_tweet']) && (!tweet['retweeted_status'])) {
      const msg = tweet.text.replace(/(\r\n\t|\n|\r\t)/gm,"").trim();
      const SCORE = sentiment.analyze(msg).comparative;
      let tweetObj = {
          date: tweet['created_at'],
          handle: tweet.user['screen_name'],
          location: tweet.user.location,
          msg
        };

      if (SCORE > 0) {
        pos_tweets.push(tweetObj);
        tweetObj.type = 'positive';
      }
      if (SCORE < 0) {
        neg_tweets.push(tweetObj);
        tweetObj.type = 'negative';
      }

      if (SCORE === 0) {
        neut_tweets.push(tweetObj);
        tweetObj.type = 'neutral';
      }
      console.log(JSON.stringify(tweetObj))
      tweet_counter++;
      TOTAL_TWEETS_PROCESSED++;
    }
  });
  }
}

let total_cycles = Math.ceil(TWEET_COUNT / TWEETS_PER_CYCLE);

getStreamTweets(total_cycles, 0);