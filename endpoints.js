/*----------Export Function----------*/
module.exports = function(app) {

    /*----------Assign Endpoints to App----------*/
    app.route('/recognize')
        .get(recognize);
}

/*----------Modules for functions----------*/
const spawn = require("child_process").spawn;

/*----------Define functions to be called----------*/
function recognize(req, res) {
    console.log("I'm gay");
    var process = spawn('python3', ['./lukeyDukey69.py']);
    process.stdout.on('data', function(data) {
        console.log(data.toString());
    });
    res.send("//ye");
}
