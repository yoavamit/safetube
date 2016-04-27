var express = require('express');
var router = express.Router();
var youtubedl = require('youtube-dl');
var fs = require('fs');

var YOUTUBE = 'http://www.youtube.com/watch?v=';

router.get('/', function(req, res, next) {
  // expecting something like this: BJd7F8sAkJ0 (the video ID in youtube)
  var videoLink = req.query.video;
  console.log(videoLink);
  var video = youtubedl(YOUTUBE + videoLink, ['--format=18'], {cmd: __dirname});
  video.on('info', function(info) {
    console.log('Download started');
    console.log('filename: ' + info.filename);
    console.log('size: ' + info.size);
  });
  video.on('complete', function complete(info) {

  });
  video.on('end', function() {
    console.log('finished downloading!');
    res.render('index', { title: 'Express' });
  });
  video.pipe(fs.createWriteStream(videoLink + '.mp4'));
});

module.exports = router;
