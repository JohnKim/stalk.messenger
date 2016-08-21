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

  static propTypes = {
    user: React.PropTypes.object.isRequired,
    onProfilePress: React.PropTypes.func,
    onPress: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  render() {

    if(this.props.onProfilePress) {

      return (

          <View style={styles.container}>
            <S5ProfilePicture
              name={this.props.user.nickName}
              profileImageUrl={this.props.user.profileImage}
              onPress={() => this.props.onProfilePress()}
              size={48}
              style={styles.image}
            />
            <TouchableHighlight onPress={this.props.onPress} >
              <View style={styles.makerDetailsContainer}>
                  <Text style={styles.nickName}>
                    {this.props.user.nickName} <Text style={styles.username}> {this.props.user.username} </Text>
                  </Text>
                <Text style={styles.statusMessage}>
                  {this.props.user.statusMessage}
                </Text>
              </View>
            </TouchableHighlight>
          </View>

      );

    } else {

      return (
        <TouchableHighlight onPress={this.props.onPress} >
          <View style={styles.container}>
            <S5ProfilePicture
              name={this.props.user.nickName}
              profileImageUrl={this.props.user.profileImage}
              size={48}
              style={styles.image}
            />
            <View style={styles.makerDetailsContainer}>
                <Text style={styles.nickName}>
                  {this.props.user.nickName} <Text style={styles.username}> {this.props.user.username} </Text>
                </Text>
              <Text style={styles.statusMessage}>
                {this.props.user.statusMessage}
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
    margin:10,
  },
  makerDetailsContainer: {
    flex: 1,
    marginRight: 10,
  },
  nickName: {
    fontSize: 15,
    marginTop: 10,
    marginBottom: 5,
    color: '#000000'
  },
  statusMessage: {
    fontSize: 12,
    marginBottom: 5,
    color: 'gray'
  },
  username: {
    fontSize: 12,
    marginBottom: 5,
    color: '#DA552F'
  },
  line:{
    marginLeft: 12,
    backgroundColor: '#cccccc',
    height:1 / PixelRatio.get(),
  }
})
