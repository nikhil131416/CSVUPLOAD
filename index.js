const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const db = require('./config/mongoose');
const expressLayouts = require('express-ejs-layouts');
const upload = require('express-fileupload');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');


//parser for form data
app.use(express.urlencoded(
    {
        extended: true
    }
));

//using session
app.use(session({
    name: 'csv',
    secret: 'blah',
    saveUninitialized: false,
    resave: false,
}));


//using express-fileupload
app.use(upload());

//Assets
app.use(express.static(path.join(__dirname, 'assets')));

//Layouts
app.use(expressLayouts);

//using flash
app.use(flash());
//setting up flash messages in locals
app.use(function(req, res, next){
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
    }
    // console.log(res.locals.flash);
    next();
});


//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//routes
app.use('/', require('./routes'));

//fire up the server
app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`****Server fired up on port: ${port}****`);
});