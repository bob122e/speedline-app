import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';

const style = {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: "#ffffff"
}

class Container extends Component {

  render() {
    var { loading, error, children } = this.props;
    return(
      <View style={style}> 
      {
        error ? <Text style={{marginTop: 30, textAlign:'center'}}>{error}</Text> :
        loading ? <ActivityIndicator style={{marginTop: 30}} /> :
        children
      }
      </View>
    )
  }

}

export default Container;