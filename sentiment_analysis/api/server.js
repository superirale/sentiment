const app = require('express')()
const bodyParser = require('body-parser')
const server = require('http').createServer(app);
const io = require('socket.io')(server.listen(3000));
const { spawn } = require('child_process');
const stripAnsi = require('strip-ansi');
// const isJSON = require('is-json');


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

io.on('connection',  (socket) =>  {

  socket.on('start-bot',  (data) => {

    let params = [data.term, data.email, data.tweets_count];
    const child = spawn('node', ['../bot.js', ...params ]);
    let resultCount = 0;

    socket.emit('bot-started', {status: true});

    child.stderr.on('close', (code) => {
      if (code !== 0) {
        console.log(`bot exit with error code ${code}`);
      }
    });

    child.stderr.on('data', err => {
      console.log(err.toString());
    });

    child.stdout.on('data', data => {
      if (!data.toString().includes("tweet_counter") && parseJson (data.toString())) {
        console.log(data.toString())
        socket.emit('response', JSON.parse(data.toString()));
      }
    });
  })
});


function parseJson (jsonString) {
  try {
      let obj = JSON.parse(jsonString);
      if (obj && typeof obj === "object") {
          return obj;
      }
  }
  catch (e) { }

  return false;
};
