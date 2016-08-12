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
import { switchTab, loadMessages, MESSAGE_SIZE } from 's5-action';
import { connect } from 'react-redux';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import SocketIO from 'react-native-socketio';

class ChatView extends Component {

  constructor(props) {

    super(props);

    console.log(props);

    this.state = {
      messages:     [],
      loadEarlier:  false,
      lastLoadedAt: null,
      isTyping:     null,
      status: 'Not connected',
    };

    this.onSend = this.onSend.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

  }

  componentWillMount() {

    // Load Messages from session-server
    this.props.loadMessages(this.props.chat).then( (result) => {

      if(result.messages.length > 0) {
        this.setState({
          messages,
          loadEarlier: result.messages.length == MESSAGE_SIZE ? true : false,
          lastLoadedAt: messages[ result.messages.length + 1 ].createdAt,
        });
      }

      var socketConfig = {
        nps: '/channel'
      };

      // @ TODO 아래부터 수정해야 함 !!
      // 아래 부터 에러나서 실행이 안됨.
      // TypeError: Cannot read property 'initialize' of undefined
      var socket = new SocketIO(result.node.url, socketConfig);

      this.socket.on('connect', () => {
        this.setState({
          status: 'Connected'
        });

      });
      this.socket.connect();


    });

  }

  componentDidMount () {
    // Do something ...
  }

  onLoadEarlier() {

    // Load Message earlier messages from session-server.
    this.props.loadMessages(this.props.chat, this.state.lastLoadedAt).then( (messages) => {

      if(messages.length > 0) {
        this.setState((previousState) => {
          return {
            messages: GiftedChat.prepend(previousState.messages, messages),
            loadEarlier: messages.length == MESSAGE_SIZE ? true : false,
            lastLoadedAt: messages[ messages.length + 1 ].createdAt,
          };
        });
      }

    });
  }

  onSend(messages = []) {
    console.log(messages);
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
    loadMessages: (chat, date) => dispatch(loadMessages(chat, date)),
  };
}

module.exports = connect(select, actions)(ChatView);
