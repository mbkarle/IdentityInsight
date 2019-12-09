/*----------Modules for functions----------*/
const spawn = require("child_process").spawn;
const multer = require('multer');
const upload = multer({dest: __dirname + '/captured_frames'});
const fs = require('fs');
const path = require('path');

/*----------Export Function----------*/
module.exports = function(app) {

    /*----------Assign Endpoints to App----------*/
    app.route('/') //assign home route for debugging purposes
	.get(home);
    app.post("/recognize", upload.single("image"), uploadRes); //assign post endpoint at /recognize route, upload a single photo from req.file, and call uploadRes
}

/*----------Define functions to be called----------*/
function recognize(req, res) {
    var process = spawn('python3', ['./recognize.py']); //spawn python script
    process.stdout.on('data', function(data) { //when script prints, use data
        console.log(data.toString());
	res.send(data.toString()); //send script output back to front end
	deleteFiles(); //call to delete pictures in capturedframes
    });
}

function deleteFiles(){
    const directory = "./captured_frames"; 
    fs.readdir(directory, (err, files) => { //loops through captured frames and deletes images
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
            });
        }
    });
}

function uploadRes(req, res) { //check if file is in request and call recognize
    if(req.file) {
	console.log("got file");
	recognize(req, res); //call recognize if file is there to begin script
	
    }
    else throw 'error';
    
}

function home(req, res) { //debugging purposes only
    console.log("accessed home directory");
    res.send("<h1>LUKE + MARKA FOREVER</h1>");
}
