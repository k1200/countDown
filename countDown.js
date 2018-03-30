(function (window, document) {
  var $d = function (params) {
    return new countDown (params.nostart, params.underway, params.isend)
  },
  countDown = function (nostart, underway, isend) {
    this.isend = isend || null;
    this.underway = underway || null;
    this.nostart = nostart || null;
  };
  countDown.prototype = (function() {
    return {
      constructor: countDown ,
      init: function (start_timestamp, end_timestamp, bool=true) {
        this.isdown = bool ;
        this.underway_code = start_timestamp > 0 ? 0 : end_timestamp <= 0 ? 2 : 1; // 进行状态： 0-未开始，1-进行中，2-已结束
        this.underway_state = ['距离开始', '距离结束', '已结束'];
        this.timestamp = start_timestamp > 0 ? start_timestamp : end_timestamp;
        this.endtime = end_timestamp ;
        this.time = { d: 0, h: 0, min: 0, s: 0 };
        this.countDown();
        return this;
      },
      initTimestamp: function () {
        var d = null, h = null, min = null, s = null;
        s = this.timestamp % 60;
        var h_min_s = this.timestamp % 3600;
        min = (h_min_s - s) / 60;
        var d_h_min_s = this.timestamp % (3600 * 24);
        h = (d_h_min_s - h_min_s) / 3600;
        d = (this.timestamp - d_h_min_s) / (3600 * 24);
        this.time.d = d < 10 ? '0' + d : d;
        this.time.h = h < 10 ? '0' + h : h;
        this.time.min = min < 10 ? '0' + min : min;
        this.time.s = s < 10 ? '0' + s : s;
      },
      initState: function () {
        this.initTimestamp() ;
        switch (parseInt(this.underway_code)) {
          case 0:
            this.nostart && this.nostart () ;
            break;
          case 1:
            this.underway && this.underway ();
            break;
          case 2:
            this.isend && this.isend ();
            clearInterval(this.interval);
            break;
        }
      },
      countDown: function() {
        var _this = this ;
        this.initState ();
        if(parseInt(this.underway_code) === 2) return false ;
        _this.interval = setInterval(function () {
          _this.isdown ? _this.timestamp -= 1 : _this.timestamp += 1;
          if(_this.timestamp === 0) {
            if(parseInt(_this.underway_code) === 0) {
              _this.underway_code = 1 ;
              _this.timestamp = _this.endtime ;
            }else {
              _this.underway_code = 2 ;
            }
          };
          _this.initState ()
        }, 1000)
      }
    }
  })();
  window.$d = $d ;
})(window, document)
