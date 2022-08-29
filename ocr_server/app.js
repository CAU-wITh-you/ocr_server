var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/ocr_from_get_image');
var healthcheckRouter = require('./routes/healthcheck');
var ocrRouter = require('./routes/ocr');
var downloadRouter = require('./routes/download_mp4');
var delete_mp4Router = require('./routes/delete_mp4');
const schedule = require('node-schedule');
const mp4_table = require('./data/data');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.all('/*', function(req, res, next) { 
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With"); 
  next(); 
});

function handleHome (req, res) {
  console.log('Terminal Home');
  res.send('Browser Home');
}

app.get('/', handleHome)

app.use('/health_check', healthcheckRouter);
// app.use('/', indexRouter);
app.use('/ocr', ocrRouter);
app.use('/mdownload', downloadRouter);
app.use('/mdelete', delete_mp4Router);

// 매 정각 mp4 파일을 체크해서 하루 이상 사용하지 않은 mp4는 삭제.
const j = schedule.scheduleJob('0 0 * * * *', function(){
  mp4_table.video_use_check();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
