/*----------Required Modules----------*/
const express = require("express");
const endpoints = require("./endpoints.js");
const bodyParser = require("body-parser");
const morgan = require("morgan");

/*----------Define App----------*/
var app = express(); //instantiate express object

app.use(bodyParser.json({limit: '5mb'})); //add middleware for requests
app.use(bodyParser.urlencoded({extended:true}));

app.use(morgan('dev')); //middleware for debugging

/*----------Define Endpoints----------*/
endpoints(app); //attach endpoints defined in endpoints.js to app object

/*----------Launch on 3000----------*/
app.listen(3000); //open to listening on port 3000
