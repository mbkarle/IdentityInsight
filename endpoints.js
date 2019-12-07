/*----------Modules for functions----------*/
const spawn = require("child_process").spawn;
const multer = require('multer');
const upload = multer({dest: __dirname + '/captured_frames'});

/*----------Export Function----------*/
module.exports = function(app) {

    /*----------Assign Endpoints to App----------*/
    app.route('/')
	.get(home);
    app./*route('/recognize')
        .get(recognize)
        .*/post("/recognize", upload.single("image"), uploadRes);
}

/*----------Define functions to be called----------*/
function recognize(req, res) {
    console.log("I'm gay");
    var process = spawn('python3', ['./recognize.py']);
    process.stdout.on('data', function(data) {
        console.log(data.toString());
    });
    res.send("//ye");
}

function uploadRes(req, res) {
	/*
    var propValue;
    for(var propName in req) {
        propValue = req[propName]

        console.log(propName,propValue);
    }*/
    /*console.log(req.file);
    res.json(req.file);*/
    console.log(req.file);
    console.log(req.body);
    if(req.file) {
	console.log("got file");
        res.json(req.file);
    }
    else throw 'error';
    
}

function home(req, res) {
    console.log("accessed home directory");
    res.send("<h1>LUKE + MARKA FOREVER</h1>");
}
