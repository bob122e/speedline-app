import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

var patco = require('../utils/patco');
var app = require('../app');
var db = require('../utils/db');

class Test extends Component {

  componentDidMount() {
    console.log('checking version...');
    patco.checkVersion(function(err, result) {
      console.log(err);
      console.log(result);
      app.download(result, function(err, result) {
        console.log(err);
        console.log(result);
        db.init(function(err, result) {
          console.log(err);
          console.log(result);
          console.log(db.stops());
        });
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default Test;