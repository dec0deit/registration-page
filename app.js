const express =require('express');
const app=express();
const routes =require('./routes')
const mongoose=require('mongoose');
const db=require('./config/key').URL;
const passport=require('passport');
mongoose.connect(db,{useNewUrlParser:true})
.then(()=>console.log('connected'))
.catch(err=>{
    console.log(err);
})

require('./config/passport')(passport);
const session=require('express-session');
//expression session middware
app.use(session({
    secret: 'yo',
    resave: true,
    saveUninitialized: true,
  }))
app.use(passport.initialize());
app.use(passport.session());
const layouts=require('express-ejs-layouts');

app.use(layouts);
app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}))
app.use('/',require('./routes/index.js'))
app.use('/user',require('./routes/user.js'));
const port=5000||process.env.PORT;
app.listen(port,()=>{
    console.log('hello world'+port);
})