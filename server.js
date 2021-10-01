const hostname = "localhost";
const port = 9000;
const formidable = require('formidable');
const PNG = require("pngjs").PNG;
const vision = require("@google-cloud/vision");


const http = require('http');
const fs = require('fs');
const uploadFolder =  "/";
const getLabels = require('./tag.js').getLabels;
const grayScaleFunction = require('./grayScale.js').grayScaleFunction;
const picUpload = "UploadPhoto/";
let uploadFileForBrowser = "";
let grayScaledDir = __dirname + "/grayScalePhoto/GraySCALED1.png"


//Add async function
const server = http.createServer(async function(req, res) {
  if (req.url == "/favicon.ico") {
    return res.writeHead(404);
  }
  if (req.url == "/") {
    res.writeHead(200, { "content-type": "text/html" });
    res.end(fs.readFileSync("myPhotoAlbum.html", "utf-8"));
  }
  if (req.url === "/style.css") {
    res.writeHead(200, { "content-type": "text/css" });
    res.end(fs.readFileSync("style.css", "utf8"));
  }
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    var form = new formidable.IncomingForm();
    form.maxFieldsSize = 20 * 1024 * 1024;
    form.uploadDir = __dirname + uploadFolder;
    form.keepExtensions = true;
    form.multiples = false;

    form.on('fileBegin', function(name, file) {
        file.path = form.uploadDir + picUpload + file.name;
        uploadFileForBrowser = file.path;
    });

    form.on('file', function(name, file) {
      grayScaleFunction([uploadFileForBrowser])
      .then(msg => console.log(msg))
      .catch(msg => console.log(msg));
    });

    form.parse(req, function(err, fields, files) {
      res.writeHead(200, { "content-type": "text/html" });
      res.end(fs.readFileSync("fileSuccess.html", "utf-8"));
    });
  }

  if (req.url == "/finalPage.html") {
    res.writeHead(200, { "content-type": "text/html" });
    res.end(fs.readFileSync("finalPage.html", "utf-8"));
  }

  if (req.url == "/image-before") {
    res.writeHead(200, { "content-type": "image/png" });
    res.end(fs.readFileSync(uploadFileForBrowser), "binary");
  }

  if (req.url == "/image-after") {
    res.writeHead(200, { "content-type": "image/png" });
    res.end(fs.readFileSync(grayScaledDir), "binary");
  }


  //need to apply async function for sequence
  if (req.url == "/analysis-tags") { 
    let label = await getLabels(uploadFileForBrowser);
        console.log(label);
        res.writeHead(200, { "content-type": "application/json" });
        res.write(label);
        res.end();
  }

});

server.listen(port,  () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });


