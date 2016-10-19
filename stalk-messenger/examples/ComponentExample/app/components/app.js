/* @flow */

import React, { Component } from 'react';
import {
  AppState,
  StyleSheet,
  StatusBar,
  View,
} from 'react-native';

import AppNavigator from './navigator';

export default class App extends Component {

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(currentAppState) {
    if (currentAppState === 'active') { // active, background, inactive
      // TODO: Notification 같은 정보를 가져옴 !
    }
  }

  render() {
    return <AppNavigator />;
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
