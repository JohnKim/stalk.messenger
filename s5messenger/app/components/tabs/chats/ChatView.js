import React, { Component } from 'react';
import {
  Linking,
  Platform,
  ActionSheetIOS,
  Dimensions,
  View,
  Text,
  Navigator,
  StyleSheet,
} from 'react-native';

import Header from 'S5Header';
import { switchTab } from 's5-action';
import { connect } from 'react-redux';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';


class ChatView extends Component {

  constructor(props) {

    super(props);

console.log(props);
    this.state = {
      messages: [],
      loadEarlier: true,
      isTyping: null,
    };

    this.onSend = this.onSend.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

  }

  componentWillMount() {

    // Load Messages from session-server
    /*
    this.setState(() => {
      return {
        messages: require('./data/messages.js'),
      };
    });
    */
  }

  onLoadEarlier() {
    // Load Message earlier messages from session-server.
    /*this.setState((previousState) => {
      return {
        messages: GiftedChat.prepend(previousState.messages, require('./data/old_messages.js')),
        loadEarlier: false,
      };
    });*/
  }

  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }

  renderFooter(props) {
    if (this.state.isTyping) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.isTyping}
          </Text>
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          title="Chats"
          style={{backgroundColor: '#224488'}}
          leftItem={{
            icon: require('../../common/img/ic_keyboard_arrow_left_white.png'),
            title: 'Back',
            layout: 'icon',
            onPress: () => {
              this.props.switchTab();
              this.props.navigator.pop();
            },
          }}
        />

        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          loadEarlier={this.state.loadEarlier}
          onLoadEarlier={this.onLoadEarlier}

          user={{
            _id: this.props.user.id, // sent messages should have same user._id
          }}

          renderBubble={this.renderBubble}
          renderFooter={this.renderFooter}
        />

      </View>
    );
  }
}


const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1
	},
});

function select(store) {
  return {
    user: store.user,
  };
}

function actions(dispatch) {
  return {
    switchTab: () => dispatch(switchTab('chats')),
  };
}

module.exports = connect(select, actions)(ChatView);
