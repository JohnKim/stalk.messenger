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
  Image
} from 'react-native';

import { connect } from 'react-redux';
import { logOut, testAsync, testAsync2, updateUser } from 's5-action';

import Header from 'S5Header';
import S5Button from 'S5Button';
import ProfilePicture from 'S5ProfilePicture';

import SettingCell from './SettingCell';

var ImagePicker = require('react-native-image-picker');

var options = {
  title: 'Select Avatar',
  quality: 0.5,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

class SettingView extends React.Component {

  constructor(props) {
    super();
  }

  selectImage(){
    ImagePicker.showImagePicker(options, (response) => {

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.props.dispatch(updateUser('profileFile',response.data));
      }
    });

  }

  onPressNickName(){
    this.props.navigator.push({settingForm: 1, field:'nickName'});  
  }

  onPressStatusMessage(){
    this.props.navigator.push({settingForm: 1, field:'statusMessage'});     
  }

  render() {

    return (
      <View style={styles.container}>
        <Header
          title="Sample"
          style={{backgroundColor: '#224488'}}
        />

        <View style={styles.profileImage}>
          <ProfilePicture
            profileImageUrl={this.props.user.profileImage}
            onPress={() => this.selectImage()}
            size={100}
          />

          <Text style={{marginTop: 10}}>
            {this.props.user.email}
          </Text>
        </View>

        <SettingCell
          label="Nickname"
          text={this.props.user.nickName}
          onPress={() => this.onPressNickName()}
        />

        <SettingCell
          label="Status Message"
          text={this.props.user.statusMessage}
          onPress={() => this.onPressStatusMessage()}
        />

        <S5Button
          style={styles.button}
          caption="Log out !!"
          onPress={() => this.props.dispatch(logOut())}
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
  profileImage: {
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
  }
});

function select(store) {
  return {
    user: store.user,
  };
}

module.exports = connect(select)(SettingView);
