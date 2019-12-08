/*----------Modules for functions----------*/
const spawn = require("child_process").spawn;
const multer = require('multer');
const upload = multer({dest: __dirname + '/captured_frames'});
const fs = require('fs');
const path = require('path');

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
    var process = spawn('python3', ['./recognize.py']);
    process.stdout.on('data', function(data) {
        console.log(data.toString());
	res.send(data.toString());
	deleteFiles();
    });
}

function deleteFiles(){
    const directory = "./captured_frames";
    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
            });
        }
    });
}

function uploadRes(req, res) {
    if(req.file) {
	console.log("got file");
	recognize(req, res);
	
    }
    else throw 'error';
    
}

function home(req, res) {
    console.log("accessed home directory");
    res.send("<h1>LUKE + MARKA FOREVER</h1>");
}
