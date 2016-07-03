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
} from 'react-native';

import { connect } from 'react-redux';

import Header from 'S5Header';
import RefreshableListView from 'S5RefreshableListView';

const PAGE_SIZE = 20;

class SampleView extends React.Component {

  render() {

    return (
      <View style={styles.container}>
        <Header
          title="Sample"
          style={{backgroundColor: '#224488'}}
        />
      </View>
    );
  }

}

SampleView.propTypes = {
  user: React.PropTypes.object,
  navigator: React.PropTypes.object, // Navigator
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  }
});

function select(store) {
  return {
    user: store.user,
  };
}

module.exports = connect(select)(SampleView);
