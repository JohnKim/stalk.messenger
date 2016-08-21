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

export default class ChatCell extends Component {

  static propTypes = {
    chat: React.PropTypes.object.isRequired,
    onPress: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    console.log(props.chat);
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
            <Image source={{uri: this.props.chat.profileImage}}
              style={styles.image} />
          <View style={styles.makerDetailsContainer}>
              <Text style={styles.nickName}>
                {names.join(", ")} {userCount}
              </Text>
            <Text style={styles.makerDetails}>
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
    height: 48,
    width: 48,
    borderRadius: 25,
    marginTop: 10,
    marginRight: 15,
    marginLeft: 15,
    marginBottom:15,
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
