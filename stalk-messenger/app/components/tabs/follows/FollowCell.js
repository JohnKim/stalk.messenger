/**
 *
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
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

    return (
      <TouchableHighlight onPress={this.props.onPress} >
        <View style={styles.container}>
          <S5ProfilePicture
            key={this.props.user.id}
            name={this.props.user.nickName}
            profileFileUrl={this.props.user.profileFileUrl}
            onPress={() => this.props.onProfilePress()}
            size={48}
            style={{
              margin:10
            }}
          />
          <View style={styles.detailContainer}>
            <Text style={styles.nickName}>
              {this.props.user.nickName} <Text style={styles.username}> {this.props.user.username} </Text>
            </Text>
            <Text numberOfLines={1} style={styles.statusMessage}>
              {this.props.user.statusMessage}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );

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
  detailContainer: {
    flex: 1,
    marginRight: 10,
  },
  nickName: {
    fontSize: 15,
    marginTop: 10,
    marginBottom: 5,
    color: '#000000'
  },
  username: {
    fontSize: 12,
    marginBottom: 5,
    color: '#DA552F'
  },
  statusMessage: {
    fontSize: 12,
    marginBottom: 5,
    color: 'gray'
  }
})
