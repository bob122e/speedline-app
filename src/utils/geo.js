var db = require('./db');
var geo = require('geolib');

module.exports.current = function(callback) {
  navigator.geolocation.getCurrentPosition(
    function(position) {
      callback(null, {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      });
    },
    function(err) {
      callback(err, null);
    },
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000}
  )
}

module.exports.nearest = function(callback) {
  var self = this;
  
  self.current(function(err, pos) {
    if (err) {
      console.log(err);
      return callback(err);
    }
    var nearest = geo.findNearest({
      latitude: pos.lat,
      longitude: pos.lon
    }, db.stops());
      

    callback (null, {
      stop: db.stops()[nearest.key].stop,
      distance: nearest.distance * 0.000621371
    })

  });
}