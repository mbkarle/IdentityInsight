/*----------Required Modules----------*/
const express = require("express");
const endpoints = require("./endpoints.js")
const bodyParser = require("body-parser");
const morgan = require("morgan");

/*----------Define App----------*/
var app = express();

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({extended:true}));
/*
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({extended:true}));
*/

app.use(morgan('dev'));

/*----------Define Endpoints----------*/
endpoints(app);

/*----------Launch on 8080----------*/
app.listen(3000);
