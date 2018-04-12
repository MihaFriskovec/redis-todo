let express = require('express');
let bodyParser = require('body-parser');
let redis = require('redis');
let logger = require('morgan');
let path = require('path');

let app = express();
let client = redis.createClient();

client.on('connect', () => {
  console.log('Redis connected');
});

// views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  let title = 'Redis TODO list';

  client.lrange('tasks', 0, -1, (err, tasks) => {
    console.log(tasks);
    res.render('index', {
      title,
      tasks
    });
  });
});

app.post('/', (req, res) => {
  let task = req.body.task;

  client.rpush('tasks', task, (err, task) => {
    if (err) {
      console.log('err', err);
    }
    console.log('Task added.');
    res.redirect('/');
  });
});

app.listen(3000);

console.log("OK");

module.exports = app;
