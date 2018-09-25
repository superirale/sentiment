'use strict';
if(process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}
// dependencies
const P = require('puppeteer');

// variables

const
  GOOGLE = 'https://www.google.com/',
  GMAIL_SELECTOR = '#gb_23 > span.gbts',
  EMAIL_SELECTOR = '#Email',
  MOVE_TO_PASSWORD_SELECTOR = '#next',
  PASSWORD_SELECTOR = '#Passwd',
  {GMAIL_PWD} = process.env,
  SIGN_IN_SELECTOR = '#signIn',
  COMPOSE_EMAIL_SELECTOR = 'body > table:nth-child(17) > tbody > tr > td:nth-child(1) > table.m > tbody > tr:nth-child(1) > td > b > a',
  TO_SELECTOR = '#to',
  CC_SELECTOR = '#cc',
  SUBJECT_SELCTOR = 'body > table:nth-child(17) > tbody > tr > td:nth-child(2) > table:nth-child(1) > tbody > tr > td:nth-child(2) > form > table.compose > tbody > tr:nth-child(4) > td:nth-child(2) > input',
  MSG_BODY_SELECTOR = 'body > table:nth-child(17) > tbody > tr > td:nth-child(2) > table:nth-child(1) > tbody > tr > td:nth-child(2) > form > table.compose > tbody > tr:nth-child(8) > td:nth-child(2) > textarea',
  SEND_EMAIL_SELECTOR = 'body > table:nth-child(17) > tbody > tr > td:nth-child(2) > table:nth-child(1) > tbody > tr > td:nth-child(2) > form > table:nth-child(6) > tbody > tr > td > input[type="submit"]:nth-child(1)';

// send GMAIL
async function sendDataViaGmail(data) {
  // instantiate browser
  const browser = await P.launch({
    headless: false,
    timeout: 180000
  });
  // create blank page
  const page = await browser.newPage();
  // set viewport to 1366*768
  await page.setViewport({width: 1366, height: 768});
  // set the user agent
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)');
  // navigate to GOOGLE
  await page.goto(GOOGLE, {
    waitUntil: 'networkidle2',
    timeout: 180000
  });
  // ensure GMAIL_SELECTOR available
  await page.waitForSelector(GMAIL_SELECTOR, {timeout: 30000});
  // click on FULL_BACKGROUND_SELECTOR
  await page.click(GMAIL_SELECTOR);
  await page.waitFor(2*1000);
  // ensure EMAIL_SELECTOR available
  await page.waitForSelector(EMAIL_SELECTOR, {timeout: 30000});
  // type email address
  await page.type(EMAIL_SELECTOR, 'teliosdevservices@gmail.com', {delay: 100});
  await page.waitFor(2*1000);
  // ensure MOVE_TO_PASSWORD_SELECTOR available and click on it
  await page.waitForSelector(MOVE_TO_PASSWORD_SELECTOR, {timeout: 30000});
  await page.click(MOVE_TO_PASSWORD_SELECTOR);
  // ensure PASSWORD_SELECTOR available
  await page.waitForSelector(PASSWORD_SELECTOR, {timeout: 30000});
  // type email address
  await page.type(PASSWORD_SELECTOR, GMAIL_PWD, {delay: 100});
  await page.waitFor(2*1000);
  // ensure SIGN_IN_SELECTOR available and click on it
  await page.waitForSelector(SIGN_IN_SELECTOR, {timeout: 30000});
  await page.click(SIGN_IN_SELECTOR);
  await page.waitFor(6*1000);
  // ensure COMPOSE_EMAIL_SELECTOR is available and click on it
  await page.waitForSelector(COMPOSE_EMAIL_SELECTOR, {timeout: 30000});
  await page.click(COMPOSE_EMAIL_SELECTOR);
  await page.waitFor(2*1000);
  // ensure TO_SELECTOR is available and fill it
  await page.waitForSelector(TO_SELECTOR, {timeout: 30000});
  await page.type(TO_SELECTOR, 'demilade@tssdevs.com', {delay: 100});
  await page.waitFor(2*1000);
  if(!!data.extraEmails) {
    // ensure CC_SELECTOR is available and fill it
    await page.waitForSelector(CC_SELECTOR, {timeout: 30000});
    await page.type(CC_SELECTOR, data.extraEmails, {delay: 100});
    await page.waitFor(2*1000);
  }
  // ensure SUBJECT_SELCTOR is available and fill it
  await page.waitForSelector(SUBJECT_SELCTOR, {timeout: 30000});
  await page.type(SUBJECT_SELCTOR, `Sentiment Report on last 20 tweets about ${data.kword}.`, {delay: 100});
  await page.waitFor(2*1000);
  function printPosTweets(data) {
    let output = '';
    data.forEach(el => {
      output += ' \n'+ `
      Date: ${el.date}.
      Handle: ${el.handle}.
      Location: ${el.location}.
      Tweet: ${el.msg}.
      `;
    });
    return output;
  }
  function printNegTweets(data) {
    let output = '';
    data.forEach(el => {
      output += ' \n'+ `
      Date: ${el.date}.
      Handle: ${el.handle}.
      Location: ${el.location}.
      Tweet: ${el.msg}.
      `;
    });
    return output;
  }
  function printNeutTweets(data) {
    let output = '';
    data.forEach(el => {
      output += ' \n'+ `
      Date: ${el.date}.
      Handle: ${el.handle}.
      Location: ${el.location}.
      Tweet: ${el.msg}.
      `;
    });
    return output;
  }
  const
    posOut = printPosTweets(data.pos),
    negOut = printNegTweets(data.neg),
    neutOut = printNeutTweets(data.neut);
  // ensure MSG_BODY_SELECTOR is available and fill it
  await page.waitForSelector(MSG_BODY_SELECTOR, {timeout: 30000});
  await page.type(MSG_BODY_SELECTOR, `Hi,

    Please find below the information you requested.

    Total number of positive tweets: ${data.pos.length}.
    Total number of negative tweets: ${data.neg.length}.
    Total number of neutral tweets: ${data.neut.length}.

    Positive Tweets:
    ${posOut}

    Neutral Tweets:
    ${negOut}

    Negative Tweets:
    ${neutOut}
    `);
  await page.waitFor(2*1000);
  // ensure SEND_EMAIL_SELECTOR and click it
  await page.waitForSelector(SEND_EMAIL_SELECTOR, {timeout: 30000});
  await page.click(SEND_EMAIL_SELECTOR);
  return setTimeout(async () => {
    await page.close();
    await browser.close();
    return process.exit(0);
  }, 5000);
}

module.exports = sendDataViaGmail;
