/**
 *
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  StyleSheet,
  PixelRatio,
} from 'react-native';

import { S5ProfilePicture } from 's5-components';

export default class FollowCell extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
    };
  }

  render() {

    if(this.props.onProfilePress) {

      return (

          <View style={styles.container}>
            <S5ProfilePicture
              profileImageUrl={this.state.user.profileImage}
              onPress={() => this.props.onProfilePress()}
              size={48}
              style={styles.image}
            />
            <TouchableHighlight onPress={this.props.onPress} >
              <View style={styles.makerDetailsContainer}>
                  <Text style={styles.makerTitle}>
                    {this.state.user.username}
                  </Text>
                <Text style={styles.makerDetails}>
                  {this.state.user.statusMessage}
                </Text>
              </View>
            </TouchableHighlight>
          </View>

      );

    } else {

      return (
        <TouchableHighlight onPress={this.props.onPress} >
          <View style={styles.container}>
              <Image source={{uri: this.state.user.profileImage}}
                style={styles.image} />
            <View style={styles.makerDetailsContainer}>
                <Text style={styles.makerTitle}>
                  {this.state.user.nickName}
                </Text>
              <Text style={styles.makerDetails}>
                {this.state.user.username}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      );

    }


  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFD',
  },
  image: {
    margin:10
  },
  makerDetailsContainer: {
    flex: 1,
    marginRight: 10,
  },
  makerTitle: {
    fontSize: 15,
    marginTop: 10,
    marginBottom: 5,
    color: '#DA552F'
  },
  makerDetails: {
    fontSize: 12,
    marginBottom: 5,
    color: 'gray'
  },
  line:{
    marginLeft: 12,
    backgroundColor: '#cccccc',
    height:1 / PixelRatio.get(),
  }
})
