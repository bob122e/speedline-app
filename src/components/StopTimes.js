import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import ViewContainer from './ViewContainer';
import NextTimes from './NextTimes';
import _ from 'lodash';

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch'
  },
})

class StopTimes extends Component {
  render() {

    var east = _.filter(this.props.times, x => x.route_id == 1)
    var west = _.filter(this.props.times, x => x.route_id == 2)

    return (
      <ViewContainer style={styles.container}>
        { this.props.stop.stop_id == 13 ? <ViewContainer /> :
          <ViewContainer>
            <NextTimes times={west} />
          </ViewContainer>
        }
        { this.props.stop.stop_id  == 1 ? <ViewContainer /> :
          <ViewContainer>
            <NextTimes times={east} />
          </ViewContainer>
        }

      </ViewContainer>
    )
  }
}

export default StopTimes
