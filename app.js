const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const cookieEncrypt = require('cookie-encrypter');
const crypto=require('crypto');
const cookiePw=crypto.createHash("md5").update("cookeiPw123@").digest("hex");
const logger = require('morgan');
const session=require('express-session');
const MemoryStore=require("memorystore")(session);



const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const userService = require("./model/service/UsersService");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(cookiePw));
app.use(cookieEncrypt(cookiePw));

app.use(express.static(path.join(__dirname, 'public')));//정적리소스위치

app.use(session({
  secret:'my-secret-key',
  resave:false,
  saveUninitialized:true,
  store: new MemoryStore({
    checkPeriod:2*60*60*1000
  })
}));

app.use(async function(req, res, next){
  let{autoLoginId,autoLoginPw}=req.signedCookies;
  if(autoLoginId&&autoLoginPw){
    const userService=require("./model/service/UsersService");
    const user=await userService.login(autoLoginId,autoLoginPw);
    if(user) req.session.loginUser=user;
  }
  next();
})

app.use(async function(req, res, next){
  res.locals.loginUser=req.session.loginUser;
  next();
})



app.use('/', indexRouter);
app.use('/users', usersRouter);

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



app.listen(4000,()=>{
  console.log("http://localhost:4000 gabojago Admin page")
});
module.exports = app;
