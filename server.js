const express=require('express');
const path=require('path');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const morgan=require('morgan');
const router=require('./routes/index');
const exphbs=require('express-handlebars')
const connectDB=require('./config/db');
const passport=require('passport')
const session = require('express-session')
const methodOverride=require('method-override')
const MongoStore=require('connect-mongo')(session);
dotenv.config({path:'./config/config.env'});

//passport config
require('./config/passport')(passport);

connectDB();
const app=express();

//body parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//method override
app.use(methodOverride(function(req,res){
  if(req.body && typeof req.body=="object" && "_method" in req.body){
    var method=req.body._method;
    delete req.body._method;
    return method
  }
}))

//logging
if(process.env.NODE_ENV=='devlopment'){
    app.use(morgan('dev'))
}

//static
app.use(express.static(path.join(__dirname,'public')))


//handlebars
const {formatDate,truncate,stripTags,editIcon,select}=require('./helper/hbs');

//handlebars
app.engine('.hbs', exphbs({helpers:{
  formatDate,
  truncate,
  stripTags,
  editIcon,
  select
},defaultLayout:'main',extname:'.hbs'}));
app.set('view engine', '.hbs');

//sessions
var sess = {
    secret: 'keyboard cat',
    resave:false,
    saveUninitialized:false,
    store:new MongoStore({mongooseConnection:mongoose.connection})//store our connection session i.e it prevent our data to be lost in refreshing page
  }

  app.use(session(sess));
//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//global variables
app.use(function(req,res,next){
  res.locals.user=req.user || null
  next()
 })

app.use('/',router);
app.use('/auth',require('./routes/auth'));
app.use('/stories',require('./routes/stories'));
const PORT=process.env.PORT || 5000

app.listen(
    PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    }
    )
