import { AsyncStorage } from 'react-native';
var axios = require('axios');
var a = require('async');

module.exports.checkVersion = function(callback) {
  var result = { };

  a.waterfall([
    function(next) {
      AsyncStorage.getItem('patco.version', next)
    },
    function(data, next){
      result.currentVersion = data || 0;
      axios.get('https://speedlineapp.com/version')
            .then(function(res) {
              next(null, res.data)
            })
            .catch(function(err) {
              next(err);
            });
    },
    function(data, next) {
      result.newVersion = data.version;
      result.dbUrl = data.db;
      next();
    }
  ], function(err) {
    callback(err, result);
  });
}