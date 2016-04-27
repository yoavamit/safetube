var express = require('express');
var router = express.Router();
var youtubedl = require('youtube-dl');
var fs = require('fs');
var queue = require('../models/queue');
var path = require('path');
var exec = require('child_process').exec;
var _ = require('lodash');

var YOUTUBE = 'http://www.youtube.com/watch?v=';

router.get('/push', function(req, res, next) {
  // expecting something like this: BJd7F8sAkJ0 (the video ID in youtube)
  var videoLink = req.query.video;
  var video = youtubedl(YOUTUBE + videoLink, ['--format=18'], {cmd: __dirname});
  video.on('info', function(info) {
    console.log('Download started');
    //console.log('--- all info:'  + JSON.stringify(info));
    queue.addInfo(videoLink, info);
  });
  video.on('complete', function complete(info) {

  });
  video.on('end', function() {
    console.log('finished downloading!');
    queue.add(videoLink);
    res.render('index', { title: 'Express' });
  });
  video.pipe(fs.createWriteStream(videoLink + '.mp4'));
});

router.get('/pop', function(req, res, next) {
  var id = queue.pop();
  if (id !== null) {
    var filepath = path.resolve([__dirname, '..', id.linkId].join("/") + ".mp4");
    var stat = fs.statSync(filepath);
    res.set({
      'Content-Type': 'audio/mpeg',
      'Contnet-length': stat.size,
      'Content-Disposition': 'attachment; filename=' + id.linkId + ".mp4"
    });
    var file = fs.readFileSync(filepath);
    res.write(file, 'binary');
    res.end();
  } else {
    res.send({error: 'nothing in playlist'});
  }
});

router.get('/playlist', function(req, res, next) {
  var list = queue.list();
  var details = req.query.details;
  if (details) {
    list = _.map(list, function(id) {return {id: id, info: queue.getInfo(id)};});
  }
  res.send({playlist: list});
});

router.get('/info', function(req, res, next) {
  var id = req.query.id;
  res.send(queue.getInfo(id));
});

router.get('/player', function(req, res, next) {
  // TODO: this is where all the magic suppose to happen (main user page)
  res.send({});
});

module.exports = router;
