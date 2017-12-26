import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Alert
} from 'react-native';
import { Container, StopTimes } from '../components'

var moment = require('moment');
var patco = require('../utils/patco');
var db = require('../utils/db');
var geo = require('../utils/geo');
var app = require('../app');

class NextTrain extends Component {

  onNavigatorEvent(event) {
    var self = this;
    if (event.id == 'refresh') {
      self.setState({loading: true});
      self.refresh();
    }
  }

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    this.props.navigator.setButtons({
      rightButtons: [
        { id: 'refresh', icon: app.icons.refresh }
      ]
    });
    this.refresh();
  }

  refresh() {
    var self = this;
    var now = moment().subtract(5, 'minutes')
    var time = now.format("HH:mm:ss");
    console.log(self.props.stop);
    var stop = self.props.stop;
    var stop_id = stop.stop_id
    self.props.navigator.setTitle({ title: stop.stop_name });

    db.calendar(now, function(err, data) {
      var service_id = data.service_id

      db.stop_times(service_id, stop_id, time, function(err, data) {

        self.setState({
          stop: stop,
          times: data,
          loading: false
        })

      });
    });
  }

  render() {
    var state = this.state;
    return (
      <Container loading={state.loading} error={state.error}>
        <StopTimes stop={state.stop} times={state.times} />
      </Container>
    );
  }

}


export default NextTrain;