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
import { logOut, testAsync, testAsync2 } from 's5-action';

import Header from 'S5Header';
import S5Button from 'S5Button';
import ProfilePicture from 'S5ProfilePicture';

class SampleView extends React.Component {

  testFunc() {

    this.props.dispatch(testAsync2());

  }

  selectImage(){
    //TODO : Impl this;
    console.log( ' impl this ' );
  }

  render() {

    return (
      <View style={styles.container}>
        <Header
          title="Sample"
          style={{backgroundColor: '#224488'}}
        />

        <View style={styles.profile}>
          <ProfilePicture
            profileImageUrl={this.props.user.profileImage}
            onPress={() => this.selectImage()}
            size={100}
          />

          <Text style={{marginTop: 10}}>
            {this.props.user.email}
          </Text>
        </View>

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
    marginBottom: 20,
    marginHorizontal: 20,
    alignSelf: 'stretch',
  },
  profile: {
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
});

function select(store) {
  return {
    user: store.user,
  };
}

module.exports = connect(select)(SampleView);
