/**
 *
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import {
  View,
  Navigator,
  StyleSheet,
  Text,
  TouchableHighlight,
} from 'react-native';

import { connect } from 'react-redux';
import { logOut } from 's5-action';

import Header from 'S5Header';
import S5Button from 'S5Button';

class SampleView extends React.Component {

  testFunc() {
    console.log('SAMPLE');
  }

  render() {

    return (
      <View style={styles.container}>
        <Header
          title="Sample"
          style={{backgroundColor: '#224488'}}
        />

        <S5Button
          style={styles.button}
          caption="Log out !!"
          onPress={() => this.props.dispatch(logOut())}
        />

        <S5Button
          type="secondary"
          caption="Test It."
          onPress={() => this.testFunc()}
        />

      </View>
    );
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
    alignSelf: 'stretch',
  },
});

function select(store) {
  return {
    user: store.user,
  };
}

module.exports = connect(select)(SampleView);
