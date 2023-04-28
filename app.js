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
<<<<<<< HEAD
const qnasRouter=require('./routes/qnas');
const qnaReplysRouter=require('./routes/replys');

const userService = require("./model/service/UsersService");
const qnaService = require("./model/service/QnasService");
const qnaReplysService = require("./model/service/QnaReplysService");
=======
const tripsRouter = require('./routes/trips');
const commsRouter = require('./routes/comms');
>>>>>>> add9f1274dfafe9783bd96a3f2724a3f3122d4f4

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
const flash = require('connect-flash');
app.use(flash());

app.use(async function(req, res, next){
  let{autoLoginId,autoLoginPw}=req.signedCookies;
  if(autoLoginId&&autoLoginPw){
    const userService=require("./model/service/UsersService");
    const user=await userService.login(autoLoginId,autoLoginPw);
    if(user) req.session.loginUser=user;
  }
  next();
})
app.use(function (req, res, next){
  const actionMsg = req.flash("actionMsg")[0]; //호출과 즉시 세션에서 삭제함
  console.log(actionMsg);
  if (actionMsg) {
    res.locals.actionMsg = actionMsg;
  }
  //redirect 되는 페이지까지만 유지되는 세션으로 action 성공 실패 메세지를 pug 에 렌더함
  if(req.session.loginUser)res.locals.loginUser=req.session.loginUser;
  next();
});

/*app.use( function (req, res, next ){
  if(req.path==="/" || req.path==="/users/login.do" ){
    next();
  }else{
    if(req.session.loginUser){
      next();
    }else{
      res.redirect("/users/login.do");
    }
  }
});*/


app.use('/', indexRouter);
app.use('/users', usersRouter);
<<<<<<< HEAD
app.use('/qnas', qnasRouter);
app.use('/qnas/reply',qnaReplysRouter);




=======
app.use('/trips', tripsRouter);
app.use('/comms', commsRouter);
>>>>>>> add9f1274dfafe9783bd96a3f2724a3f3122d4f4

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
