import Icon from 'react-native-vector-icons/Ionicons';

var a_ = require('async');

module.exports.init = function(callback) {
  var icons = {}
  a_.parallel([
    function(cb) {
      Icon.getImageSource('ios-train', 30)
          .then(function(icon) {
            icons.train = icon;
            cb();
          });
    },
    function(cb) {
      Icon.getImageSource('ios-map', 30)
          .then(function(icon) {
            icons.map = icon;
            cb();
          });
    },
    function(cb) {
      Icon.getImageSource('ios-refresh', 30)
          .then(function(icon) {
            icons.refresh = icon;
            cb();
          });
    }
  ], function(err) {
    callback(err, icons);
  })
}