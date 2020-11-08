const express=require('express');
const path=require('path');
const dotenv=require('dotenv');
const morgan=require('morgan');
const router=require('./routes/index');
const exphbs=require('express-handlebars')
const connectDB=require('./config/db');

dotenv.config({path:'./config/config.env'});
connectDB();
const app=express();

//logging
if(process.env.NODE_ENV=='devlopment'){
    app.use(morgan('dev'))
}

//static
app.use(express.static(path.join(__dirname,'public')))

//handlebars
app.engine('.hbs', exphbs({defaultLayout:'main',extname:'.hbs'}));
app.set('view engine', '.hbs');

app.use('/',router);

const PORT=process.env.PORT || 5000

app.listen(
    PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    }
    )
