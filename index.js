const express = require('express');
const app = express();
const port = 8000;
const db = require('./config/mongoose');
const expressLayouts = require('express-ejs-layouts');
const upload = require('express-fileupload');
const path = require('path');


//parser for form data
app.use(express.urlencoded(
    {
        extended: true
    }
));


app.use(upload());

//Assets
app.use(express.static(path.join(__dirname, 'assets')));

//Layouts
app.use(expressLayouts);


//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//routes
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`****Server fired up on port: ${port}****`);
});