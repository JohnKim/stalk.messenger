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
import { logOut, testAsync, testAsync2, updateProfileImage } from 's5-action';

import Header from 'S5Header';
import S5Button from 'S5Button';
import ProfilePicture from 'S5ProfilePicture';
import Parse from 'parse/react-native';

var ImagePicker = require('react-native-image-picker');

var options = {
  title: 'Select Avatar',
  quality: 0.5,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

class SampleView extends React.Component {

  testFunc() {

    this.props.dispatch(testAsync2());

  }

  selectImage(){
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.props.dispatch(updateProfileImage(response));
      }
    });

  }

  /**
  uploadImage(fileData, callback){

    var fileStr = 'data:image/jpeg;base64,' + fileData;
    var file = { base64: fileStr } ;
    var fileNm = 'image.png';

    var parseFile = new Parse.File(fileNm, file);
    parseFile.save().then(function() {
      console.log ( 'success : ' + parseFile.url() );
    }, function(error) {
      console.log ( 'error' );
    });
  }
  */

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
