/*----------Required Modules----------*/
const express = require("express");
const endpoints = require("./endpoints.js")

/*----------Define App----------*/
var app = express();

/*----------Define Endpoints----------*/
endpoints(app);

/*----------Launch on 8080----------*/
app.listen(8080);
