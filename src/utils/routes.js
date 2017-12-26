import { Navigation } from 'react-native-navigation';
import { Download, NextTrain, Stops, Stop } from '../screens';

module.exports.init = function() {
  Navigation.registerComponent('Download', () => Download);
  Navigation.registerComponent('NextTrain', () => NextTrain);
  Navigation.registerComponent('Stops', () => Stops);
  Navigation.registerComponent('Stop', () => Stop);
}