const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const indexRouter = require('./routes/index.js');
const topicRouter = require('./routes/topic.js');
const memberRouter = require('./routes/member.js');
const authorRouter = require('./routes/author.js');
const dbconfig = require('./config/dbconfig.json');

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: true })); //post 요청이 들어올 때 request.body로 값을 깔끔하게 가져옴
app.use(express.json());

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: new FileStore(),
    resave: false,
    saveUninitialized: true
}));

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/member', memberRouter);
app.use('/author', authorRouter);

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

app.listen(3000);