const express=require('express');
const dotenv=require('dotenv');
const morgan=require('morgan');
const router=require('./routes/main');
const exphbs=require('express-handlebars')
const connectDB=require('./config/db');

dotenv.config({path:'./config/config.env'});
connectDB();
const app=express();

//logging
if(process.env.NODE_ENV=='devlopment'){
    app.use(morgan('dev'))
}

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
