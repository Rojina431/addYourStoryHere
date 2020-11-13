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
const MongoStore=require('connect-mongo')(session);
dotenv.config({path:'./config/config.env'});

//passport config
require('./config/passport')(passport);

connectDB();
const app=express();

//body parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//logging
if(process.env.NODE_ENV=='devlopment'){
    app.use(morgan('dev'))
}

//static
app.use(express.static(path.join(__dirname,'public')))


//handlebars
const {formatDate}=require('./helper/hbs');
//handlebars
app.engine('.hbs', exphbs({helpers:{
  formatDate,
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

app.use('/',router);
app.use('/auth',require('./routes/auth'));
app.use('/stories',require('./routes/stories'));
const PORT=process.env.PORT || 5000

app.listen(
    PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    }
    )
