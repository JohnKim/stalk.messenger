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

import { connect } from 'react-redux';
import { switchTab, loadMessages, MESSAGE_SIZE } from 's5-action';
import { S5Header, S5Alert, S5Drawer } from 's5-components';

import ControlPanel from './ControlPanel';

import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
var XPush = require( 'react-native-xpush-client' );

import { SERVER_URL, APP_ID } from '../../../../env.js';

class ChatView extends Component {

  constructor(props) {

    super(props);

    this.state = {
      messages:     [],
      loadEarlier:  false,
      lastLoadedAt: null,
      isTyping:     null,
      connected:    false,
      node:         {},
    };

    this.onSend             = this.onSend.bind(this);
    this.renderBubble       = this.renderBubble.bind(this);
    this.renderFooter       = this.renderFooter.bind(this);
    this.renderSend         = this.renderSend.bind(this);
    this.onLoadEarlier      = this.onLoadEarlier.bind(this);
    this.openControlPanel   = this.openControlPanel.bind(this);
    this.closeControlPanel  = this.closeControlPanel.bind(this);

    XPush.init( SERVER_URL, APP_ID, this.props.user.id, 'web' );
  }

  closeControlPanel() {
    this._drawer.close()
  };

  openControlPanel() {
    this._drawer.open()
  };

  componentDidMount() {

    console.log( this.props.chat );

    // Load Messages from session-server
    this.props.loadMessages(this.props.chat).then(
      (result) => {

        if(result.messages.length > 0) {

          this.setState({
            messages: result.messages,
            loadEarlier: result.messages.length == MESSAGE_SIZE ? true : false,
            lastLoadedAt: result.messages[ result.messages.length - 1 ].createdAt,
          });

        }

        this.setState({ node: result.node });

        /** @ TODO : HAVE TO BE SEPERATED !!!! **/

        var socketConfig = {
          nsp: '/channel',
          forceWebsockets: true,
          connectParams: {
            A: result.node.app,
            S: result.node.name,
            C: this.props.chat.channelId,
            U: this.props.user.id,
            // D: Device ID !! ???
          }
        };

        var self = this;

        XPush.connect( this.props.chat.channelId, function(err, data){

          if( err ){
            self.setState({ connected: false });
          } else {
            self.setState({ connected: true });
          }

          XPush.onMessage( function(message){
            console.log('------ 받음 - ', message);
            self.setState((previousState) => {
              return { messages: GiftedChat.append(previousState.messages, message) };
            });
          });
        });
      },
      (error) => {
        console.warn(error);
        this.refs['alert'].alert('error', 'Error', 'an error occured, please try again late');
      }
    );

  }

  componentWillUnmount() {
    if(this.socket) {
      this.socket.disconnect();
    }
  }

  onLoadEarlier() {

    // Load Message earlier messages from session-server.
    this.props.loadMessages(this.props.chat, this.state.lastLoadedAt).then( (result) => {

      if(result.messages.length > 0) {
        this.setState((previousState) => {

          return {
            messages: GiftedChat.prepend(previousState.messages, result.messages),
            loadEarlier: result.messages.length == MESSAGE_SIZE ? true : false,
            lastLoadedAt: result.messages[ result.messages.length - 1 ].createdAt,
          };
        });
      }

    });
  }

  onSend(messages = []) {

    if( this.state.connected ) {
      for (x in messages) {
        console.log('------ 보냄 - ', messages[x]);
        XPush.send( messages[x] );
      }
    }
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
    if (this.socket && this.socket.isConnected && !this.state.connected) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Connection was failed. Reconnecting...
          </Text>
        </View>
      );
    }
    return null;
  }

  renderSend(props) {
    if (this.state.connected) {
      return (
        <Send {...props}/>
      );
    }
    return null;
  }

  onCloseAlert() {

  }

  render() {

    const rightItem = {
      title: 'search',
      icon: require('./img/icon.png'),
      onPress: this.openControlPanel.bind(this),
    };

    return (
      <View style={styles.container}>
        <S5Drawer
          type="overlay"
          content={<ControlPanel closeDrawer={this.closeControlPanel} chat={this.props.chat}/>}
          ref={(ref) => this._drawer = ref}
          tapToClose={true}
          openDrawerOffset={0.2} // 20% gap on the right side of drawer
          side="right"
          panCloseMask={0.2}
          closedDrawerOffset={-3}
          styles={{main: {shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 15}}}
          tweenHandler={(ratio) => ({
            main: { opacity:(2-ratio)/2 }
          })}
          >
          <S5Header
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
            rightItem={{...rightItem, layout: 'icon'}}
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
            renderSend={this.renderSend}

            textInputProps={{
              editable: this.state.connected,
            }}
          />
        </S5Drawer>

        <S5Alert ref={'alert'} />

      </View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1
	},
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
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
