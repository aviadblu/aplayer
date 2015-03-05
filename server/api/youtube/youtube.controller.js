var config = require('../../config/environment');
var walk    = require('walk');
var path = require('path');
var YouTube = require('youtube-node');
var youTube = new YouTube();
var userServices = require('../user/services');

youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

// youtube oauth public pass: notasecret

var youtube = {
  search: function(req, res) {

    var limit = req.query.limit + 10 || 15;
    var return_limit = req.query.limit || 10;
    youTube.search(req.query.key, limit, function(resultData) {

      var c = 0;
      var results = [];
      for(var i in resultData.items) {
        if(resultData.items[i].id.videoId) {
          results.push(resultData.items[i]);

          c++;
          if(c == return_limit)
            break;
        }
      }
      return res.send(results);
    });


  },

  loadExtraData: function(req, res) {
    var song_id = req.query.songId;
    var accessToken = req.get('x-access-token');
    if (!accessToken) {
      return res.status(400).send("Please log in!");
    }

    youTube.getById(song_id, function(resultData) {


      var dataToSave = {
        duration: {
          length: convert_time(resultData.items[0].contentDetails.duration),
          text: getTimeFrameFormat(convert_time(resultData.items[0].contentDetails.duration))
        },
        published: resultData.items[0].snippet.publishedAt,
        thumbnails: resultData.items[0].snippet.thumbnails
      };



      userServices.updateSongData(accessToken,song_id,{extra_data: dataToSave},function(){

      });

      return res.send(dataToSave);
    });



    //userServices.updateSongData(accessToken,song_id,,function(){
    //  return res.send(res);
    //});


  }
};


function convert_time(duration) {
  var a = duration.match(/\d+/g);

  if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
    a = [0, a[0], 0];
  }

  if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
    a = [a[0], 0, a[1]];
  }
  if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
    a = [a[0], 0, 0];
  }

  duration = 0;

  if (a.length == 3) {
    duration = duration + parseInt(a[0]) * 3600;
    duration = duration + parseInt(a[1]) * 60;
    duration = duration + parseInt(a[2]);
  }

  if (a.length == 2) {
    duration = duration + parseInt(a[0]) * 60;
    duration = duration + parseInt(a[1]);
  }

  if (a.length == 1) {
    duration = duration + parseInt(a[0]);
  }
  return duration
}

function getTimeFrameFormat(dec) {
  // convert time in decimal format to ss:ff format for display
  var ss=String(dec).match(/(\d+)(\.\d+)?/);
  if(!ss) {
    return;
  }

  if(!ss[2]) {
    ss[2]=0;
  }

  ss[2]=parseInt(ss[2]*100);

  var total_sec = parseInt(ss[1]);

  var min = Math.floor(total_sec/60);

  var sec = total_sec - 60 * min;

  var m = min>=10?min:""+min;
  var s = parseInt(sec)>=10?sec:"0"+sec;
  var ds = parseInt(ss[2])>=10?ss[2]:"0"+ss[2];

  return m+":"+s;//+":"+ds;
}

module.exports = youtube;
