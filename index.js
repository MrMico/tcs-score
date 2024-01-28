const express = require("express");
const fileUpload = require('express-fileupload');
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const lodash = require('lodash');
var snap = { "home": 0, "away": 0, "per": 0, "paused": true, "time": 0, "epoch": 0, "home_timeouts":0, "away_timeouts":0, "home_bonus":false, "away_bonus":false, "home_fouls":0, "away_fouls":0, "home_poss":true, "away_poss":false, "home_name": "Home", "away_name": "Away", "home_color1":"#ff0000", "away_color1":"#ff0000", "home_color2": "#ff0000", "away_color2": "#ff0000", "home_image":"" , "away_image":"", "show_timer":false};


var d = new Date();
var interval = 0;
function getEpochTime() {
  var d = new Date();
  var epochCalc = Math.round(d.getTime() / 1000);
  return epochCalc;
  
}
io.on("connection", (socket) => {
  console.log("user connected");
  socket.emit("new snapshot", snap);
  socket.on("new snapshot", (snapin) => {
    snap = snapin;
    console.log(snapin);
    io.emit("new snapshot", snap);
    clearInterval(interval);
    interval = setInterval(checkForZero,1000);
    console.log("Updated Snapshot");
  });
});

function checkForZero(){
  if(snap.epoch == getEpochTime()+2 && snap.paused == false){
    snap.paused = true;
    snap.time = 0;
    io.emit("new snapshot", snap);
    console.log("zeroed the timer");
  }
}
app.use(express.static('public'));
app.use(
    fileUpload({
        limits: {
            fileSize: 10000000,
        },
        abortOnLimit: true,
    })
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/edit", (req, res) => {
  res.sendFile(__dirname + "/edit.html");
});

app.get("/view", (req, res) => {
  res.sendFile(__dirname + "/view.html");
});

app.get("/scoreboard", (req, res) => {
  res.sendFile(__dirname + "/scoreboard.html");
});

app.get("/testboard", (req,res) => {
  res.sendFile(__dirname + "/testboard.html");
});

app.get("/scorebug", (req,res) => {
  res.sendFile(__dirname + "/scorebug.html");
});

app.get("/form-home", (req,res) => {
  res.sendFile(__dirname + "/form-home.html")
});
app.get("/form-away", (req,res) => {
  res.sendFile(__dirname + "/form-away.html")
});
app.get("/homeimage.png", (req,res) => {
  res.sendFile(__dirname + "/upload/home.png")
});
app.get("/awayimage.png",(req,res) => {
  res.sendFile(__dirname + "/upload/away.png")
});
app.post('/upload-home', (req, res) => {
    // Get the file that was set to our field named "image"
    const { image } = req.files;

    // If no image submitted, exit
    if (!image) return res.sendStatus(400);

    // If does not have image mime type prevent from uploading
    //if (/^image/.test(image.mimetype)) return res.sendStatus(400);

    // Move the uploaded image to our upload folder
    image.mv(__dirname + '/upload/' + "home.png");

    // All good
    res.sendStatus(200);
});
app.post('/upload-away', (req, res) => {
    // Get the file that was set to our field named "image"
    const { image } = req.files;

    // If no image submitted, exit
    if (!image) return res.sendStatus(400);

    // If does not have image mime type prevent from uploading
    //if (/^image/.test(image.mimetype)) return res.sendStatus(400);

    // Move the uploaded image to our upload folder
    image.mv(__dirname + '/upload/' + "away.png");

    // All good
    res.sendStatus(200);
});

server.listen(80, () => {
  console.log("listening on *:80");
});
