;
(function () {
  'use strict';
  angular
    .module('player_service', [])
    .service('player_service', ['$http', function ($http) {

      this.mixArray = function (array, shuffle) {

        var o = [], index;
        for (var c in array) {
          index = parseInt(c);
          o[index] = array[c];
          o[index].original_index = index;
        }

        if (shuffle) {
          for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        }

        return o;

      };


      this.getTimeFrameFormat = function (dec) {
        // convert time in decimal format to ss:ff format for display
        var ss = String(dec).match(/(\d+)(\.\d+)?/);
        if (!ss) {
          return;
        }

        if (!ss[2]) {
          ss[2] = 0;
        }

        ss[2] = parseInt(ss[2] * 100);

        var total_sec = parseInt(ss[1]);

        var min = Math.floor(total_sec / 60);

        var sec = total_sec - 60 * min;

        var m = min >= 10 ? min : "" + min;
        var s = parseInt(sec) >= 10 ? sec : "0" + sec;
        var ds = parseInt(ss[2]) >= 10 ? ss[2] : "0" + ss[2];

        return m + ":" + s;//+":"+ds;
      };

      this.getBG = function (track) {

        var thumbs = track.extra_data.thumbnails;

        var bg_url;
        var res = 0;

        for (var t in thumbs) {
          var r = thumbs[t].height * thumbs[t].width;
          if(r > res) {
            res = r;
            bg_url = thumbs[t].url;
          }
        }

        return bg_url;

      };

      this.getSmallestThumb = function (track) {

        var thumbs = track.extra_data.thumbnails;

        var bg_url;
        var res = 50000000000;

        for (var t in thumbs) {
          var r = thumbs[t].height * thumbs[t].width;
          if(r < res) {
            res = r;
            bg_url = thumbs[t].url;
          }
        }

        return bg_url;

      };

      this.getClosetSizeThumb = function (track, size) {

        var thumbs = track.extra_data.thumbnails;

        var req_res = size.width * size.height;

        var bg_url;
        var dif = 50000000000;

        for (var t in thumbs) {
          var r = thumbs[t].height * thumbs[t].width;
          var c_diff = Math.abs(req_res -r);

          if(c_diff < dif) {
            dif = c_diff;
            bg_url = thumbs[t].url;
          }

        }

        return bg_url;

      };

    }]);

}).call(this);
