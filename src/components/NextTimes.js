import React, { Component } from 'react';
import {
  View,
   StyleSheet,
   Text,
   ScrollView,
   TouchableOpacity,
   ListView } from 'react-native';
import ViewContainer from './ViewContainer';
import moment from 'moment';
import _ from 'lodash';

class NextTimes extends Component {

  constructor(props) {
    super(props)
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(this.props.times),
    }
  }

  _renderRow(time) {
    return (
      <TouchableOpacity style={styles.listItem}>
        <Text style={styles.listItemText}>{ moment(time.departure_time, 'HH:mm:ss').format("h:mm a")}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    var hasTimes = false;
    if (this.props.times[0]) {
      var stop_name = this.props.times[0].trip_headsign
      var nextTime = _.filter(this.props.times, function(x) {
        return x.departure_time > moment().format("HH:mm:ss");
      })[0]

      nextTimeTime = moment(nextTime.departure_time, 'HH:mm:ss');
      var min = nextTimeTime.diff(moment(), 'minutes');
      nextTimeDepartsDisplay = `Departs in ${min} minutes`
      hasTimes = true;
    }


    if (!hasTimes) {
      return;
    }

    return (
        <ViewContainer>
          <View style={styles.headSignTextWrapper}>
            <Text style={styles.headSignText}>{stop_name}</Text>
          </View>
          <ViewContainer style={styles.container}>
            <ViewContainer style={{flex: 2, padding: 10, justifyContent: 'space-around'}}>
              <Text style={styles.nextTimeTimeText}>{nextTimeTime.format('h:mm a')}</Text>
              <Text style={styles.nextTimeDepartsText}>{nextTimeDepartsDisplay}</Text>
            </ViewContainer>
            <ViewContainer
              style={{flex: 1, borderTopWidth: 1, borderColor: '#edf0f5', borderBottomWidth: 1}}>
              <ScrollView horizontal={true}>
                <ListView
                  initialListSize={5}
                  removeClippedSubviews = {false}
                  horizontal={true}
                  dataSource={this.state.dataSource}
                  renderRow={(time) => this._renderRow(time)} />
              </ScrollView>
            </ViewContainer>
          </ViewContainer>
        </ViewContainer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
  },

  listItem: {
    padding: 20,
    borderRightWidth: 1,
    borderColor: '#edf0f5',
  },

  listItemText: {
    fontSize: 18
  },

  nextTimeTimeText: {
    fontSize: 48,
    alignSelf: 'center'
  },

  nextTimeDepartsText: {
    fontSize: 20,
    alignSelf: 'center'
  },

  headSignTextWrapper: {
    backgroundColor: '#fec43a',
    padding: 10
  },

  headSignText: {
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
  }

})

export default NextTimes