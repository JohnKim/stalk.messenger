/**
 *
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text
} from 'react-native';

class ChatsMain extends Component {

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
  };

  eventNavBarButton(key) {
    console.log(key);
  }

  constructor(props) {
    super(props);
  }

  _onRowPress = (chat) => {
    this.props.navigator.push({
      chatView: true,
      chat,
    });
  }

  render() {

    return (
      <View style={styles.container}>
        <Text>CHATS VIEW</Text>
      </View>
    );
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

module.exports = ChatsMain;
