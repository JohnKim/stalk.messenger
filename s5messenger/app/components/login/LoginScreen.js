/**
 *
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import {
  Image,
  StatusBarIOS,
  StyleSheet,
} from 'react-native';

import { connect } from 'react-redux';

import SigninView from './SigninView';
import SignupView from './SignupView';

class LoginScreen extends Component {

  state = {
    current: 'Signin',
  };

  componentDidMount() {
    StatusBarIOS && StatusBarIOS.setStyle('default');
  }

  render() {

    if(this.state.current === 'Signin') {
      return (
        <Image
          style={styles.container}
          source={require('./img/login-background.png')}>
          <SigninView
            onSwitchView={(text) => this.setState({current: text})}
          />
        </Image>
      );
    } else {
      return (
        <Image
          style={styles.container}
          source={require('./img/login-background.png')}>
          <SignupView
            onSwitchView={(text) => this.setState({current: text})}
            />
        </Image>
      );

    }
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 26,
    // Image's source contains explicit size, but we want
    // it to prefer flex: 1
    width: undefined,
    height: undefined,
  },
  section: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

module.exports = connect()(LoginScreen);
