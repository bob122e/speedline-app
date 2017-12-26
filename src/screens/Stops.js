import React, { Component } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  ListView,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Container} from '../components'

var db = require('../utils/db');


class Stops extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    }
  }

  componentDidMount() {
    var self = this;
    var stops = db.stops();
    self.setState({
      loading: false,
      dataSource: self.state.dataSource.cloneWithRows(stops),
    });
  }

  stopPressed(stop) {
    this.props.navigator.push({
      screen: 'Stop',
      passProps: {stop: stop}
    });
  }

  renderRow(stop) {
    return (
      <TouchableOpacity
        onPress={() => this.stopPressed(stop.stop)}
        style={styles.listItem}>
        <Text style={styles.listItemText}>{stop.stop.stop_name}</Text>
        <Icon style={styles.listItemIcon} name='ios-arrow-forward' size={28} />
      </TouchableOpacity>
    )
  }

  render() {
    var state = this.state;
    return (
      <Container loading={state.loading} error={state.error}>
        <ScrollView>
            <ListView
              dataSource={state.dataSource}
              renderRow={(stop) => this.renderRow(stop)} />
          </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#edf0f5',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  listItemText: {
    fontSize: 18,
    marginLeft: 10,
    alignSelf: 'flex-end'
  },

  listItemIcon: {
    marginBottom: -8
  }
})


export default Stops;