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

  constructor(props) {
    super(props);
    this.state = {
      chat: this.props.chat,
    };
  }

  render() {
    // this.state.chat.name : the name of this channel (defined from chats reducer).
    // this.state.chat.users.length : count for users in this chat channel.
    
    return (
      <TouchableHighlight onPress={this.props.onPress} >
        <View style={styles.container}>
            <Image source={{uri: this.state.chat.profileImage}}
              style={styles.image} />
          <View style={styles.makerDetailsContainer}>
              <Text style={styles.makerTitle}>
                {this.state.chat.name}
              </Text>
            <Text style={styles.makerDetails}>
               ({this.state.chat.users.length})
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
