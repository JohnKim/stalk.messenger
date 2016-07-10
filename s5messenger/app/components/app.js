/*
 * Main App 클래스
 *
 * @flow
 */

import React, { Component } from 'react';
import {
  AppState,
  StyleSheet,
  StatusBar,
  View,
} from 'react-native';

import { loadConfig, updateInstallation } from 's5-action';
import { VERSION } from '../../env.js';

import LoginScreen from './login/LoginScreen';
import AppNavigator from './navigator';
import { connect } from 'react-redux';

class App extends Component {

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    // TODO: Make this list smaller, we basically download the whole internet
    // TODO: 초기화 때 서버로 부터 가져와야 할 것들 필요 함.
    this.props.dispatch(loadConfig());

    updateInstallation({VERSION});
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

    if (!this.props.isLoggedIn) {
      return <LoginScreen />;
    }
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor="rgba(0, 0, 0, 0.2)"
          barStyle="light-content"
         />
        <AppNavigator />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function select(store) {
  return {
    isLoggedIn: store.user.isLoggedIn,
  };
}


module.exports = connect(select)(App);
