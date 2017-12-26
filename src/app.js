import { AsyncStorage } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { NextTrain, Stops, Stop } from './screens';
import { unzip } from 'react-native-zip-archive'

var a_ = require('async');
var patco = require('./utils/patco');
var db = require('./utils/db');
var RNFS = require('react-native-fs');

var icons = {}
var isConnected = false;

module.exports.icons = icons;
module.exports.isConnected = isConnected;

module.exports.init = function(callback) {
  console.log('init started');
  
  Navigation.registerComponent('NextTrain', () => NextTrain);
  Navigation.registerComponent('Stops', () => Stops);
  Navigation.registerComponent('Stop', () => Stop);

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
  ], callback)

}

module.exports.download = function(result, callback) {
  console.log('download started');
  var self = this;
  var patcoResult = result;
  var zipPath = RNFS.DocumentDirectoryPath + '/patco.sqlite.zip'

  var df = RNFS.downloadFile({
      fromUrl: patcoResult.dbUrl,
      toFile: zipPath
    });

  df.promise.then(function(result) {
    if (result.statusCode == 200) {
        unzip(zipPath, RNFS.DocumentDirectoryPath)
          .then(function(path) {
            console.log(path)
            AsyncStorage.setItem('patco.version', patcoResult.newVersion.toString())
              .then(function() {
                callback();
              }).catch(function(err) {
                console.log(err);
                callback(err);
              });
          })
          .catch(function(err) {
            callback(err);
          })
      } else {
        callback(new Error('Schedule Download Failed'));
      }
    }).catch(function(err) {
      callback(err);
    });
}

module.exports.run = function() {
  console.log('run started')
  var self = this;

  patco.checkVersion(function(err, result) {
    if (err) {
      db.init(function(err, result) {
        self.start();
      });
    } else if (result.newVersion > result.currentVersion) {
      self.download(result, function(err, data) {
        db.init(function(err, result) {
          self.start();
        });
      })
    } else {
      db.init(function(err, result) {
        self.start();
      });
    }
  });
}

module.exports.start = function() {
  console.log('start started');
  var navigatorStyle = {
    navBarBackgroundColor: '#D11241',
    navBarTextColor: '#ffffff',
    navBarButtonColor: '#ffffff'
  }

  var next = { 
    screen: 'NextTrain', 
    label: 'Next Train', 
    title: '',
    icon: icons.train,
    navigatorStyle: navigatorStyle
  };

  var stops = { 
    screen: 'Stops', 
    label: 'Stops', 
    title: 'Stops',
    icon: icons.map,
    navigatorStyle: navigatorStyle
  };


  Navigation.startTabBasedApp({
    tabs: [
      next,
      stops
    ],
    tabsStyle: { 
      tabBarButtonColor: '#e86384',
      tabBarLabelColor: '#e86384',  
      tabBarSelectedButtonColor: '#ffffff', 
      tabBarSelectedLabelColor: '#ffffff',
      tabBarBackgroundColor: '#D11241' 
    }
  });
}