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

export default class ChatCell extends Component {

  static propTypes = {
    chat: React.PropTypes.object.isRequired,
    onPress: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  renderProfilePictures(){

    let profiles = [];

    // TODO 그룹체팅의 경우, profile 이미지를 여러개 보여 줄 수 있도록 여기를 수정해야 함 !!
    this.props.chat.users.forEach( (user) => {
      let key = `${this.props.chat.channelId}_${user.id}`;
      profiles.push((
        <S5ProfilePicture
          key={key}
          name={user.nickName}
          profileImageUrl={user.profileImage}
          size={48}
          style={{
            margin:10,
            borderWidth: 1.5,
            borderColor: '#FFFFFF',
          }}
        />
      ));
    });

    return profiles;
  }

  render() {
    // this.props.chat.name : the name of this channel (defined from chats reducer).
    // this.props.chat.users.length : count for users in this chat channel.

    let names = [];
    this.props.chat.users.forEach( (user) => {
      names.push(user.nickName);
    });

    const userCount = this.props.chat.users.length > 1 ?
      (<Text style={styles.userCount}>{this.props.chat.users.length}</Text>) : null;

    return (
      <TouchableHighlight onPress={this.props.onPress} >
        <View style={styles.container}>
          {this.renderProfilePictures()}
          <View style={styles.makerDetailsContainer}>
              <Text style={styles.nickName}>
                {names.join(", ")} {userCount}
              </Text>
            <Text style={styles.messages}>
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
  userCount: {
    fontSize: 12,
    marginBottom: 5,
    color: '#DA552F'
  },
  messages: {
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
