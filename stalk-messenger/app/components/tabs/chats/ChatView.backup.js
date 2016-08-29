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
  TouchableHighlight,
  Image
} from 'react-native';

import { connect } from 'react-redux';
import { switchTab, loadMessages, setLatestMessage, MESSAGE_SIZE } from 's5-action';
import { S5Header, S5Alert, S5Drawer } from 's5-components';
import { uploadImage } from 's5-action';

import ControlPanel from './ControlPanel';

import { GiftedChat, Bubble, Send, Composer } from 'react-native-gifted-chat';

import { SERVER_URL, APP_ID } from '../../../../env.js';

var XPush = require( 'react-native-xpush-client' );
var ImagePicker = require('react-native-image-picker');


var imagePickerOptions = {
  title: 'Select Image',
  quality: 0.5,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

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
    this.renderComposer     = this.renderComposer.bind(this);
    this.renderSend         = this.renderSend.bind(this);
    this.onLoadEarlier      = this.onLoadEarlier.bind(this);

    this.openControlPanel   = this.openControlPanel.bind(this);
    this.closeControlPanel  = this.closeControlPanel.bind(this);
    this.openMenu  = this.openMenu.bind(this);
    this.closeMenu  = this.closeMenu.bind(this);
    this.selectImage = this.selectImage.bind(this);

    XPush.init( SERVER_URL, APP_ID, this.props.user.id, 'web' );
  }

  componentDidMount() {

    if(this.props.chat.type != 'TEMP') {

      // Load Messages from session-server
      this.props.loadMessages(this.props.chat).then(
        (result) => {

          if(result.messages.length > 0) {

            this.setState({
              messages: result.messages,
              loadEarlier: result.messages.length == MESSAGE_SIZE ? true : false,
              lastLoadedAt: result.messages[ result.messages.length - 1 ].createdAt,
            });

            // set latest message !
            this.props.setLatestMessage(this.props.chat.channelId, result.messages[0].text);

          }

          this.setState({ node: result.node });

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

                // set latest message !
                self.props.setLatestMessage(self.props.chat.channelId, message.text);

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

  }

  componentWillUnmount() {
    if(this.socket) {
      this.socket.disconnect();
    }
  }

  openControlPanel() {
    this._drawer.open()
  };

  closeControlPanel() {
    this._drawer.close()
  };

  openMenu(){
    this.setState({ menuOpened: true });
    this.selectImage();
  };

  closeMenu(){
    this.setState({ menuOpened: false });
  };

  selectImage(){
    var self = this;
    ImagePicker.showImagePicker(imagePickerOptions, (response) => {

      if (response.didCancel) {
        console.log('User cancelled photo picker');
        this.closeMenu();
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        var data = {
          C : this.props.chat.channelId,
          U : this.props.user.id,
          imgBase64 : response.data
        };

        uploadImage(data, function(err, result){

          if( self.state.connected ) {
            var message = {
              image: result,
              user: { _id: self.props.user.id },
              createdAt: new Date(),
              _id: 'temp-id-' + Math.round(Math.random() * 1000000)
            };

            XPush.send( message );
          }

          self.closeMenu();
        });
      }
    });
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

  renderComposer(props){
    return (
      <View style={styles.composer}>
        {this.renderMenu()}
        <Composer {...props}/>
      </View>
    );
  }

  renderMenu(props){
    if( this.state.menuOpened ){
      return (
        <TouchableHighlight onPress={this.closeMenu} underlayColor={'transparent'} >
          <Image
            source={require('./img/icon-clear.png')}
            style={styles.menuIcon}
            />
        </TouchableHighlight>
      );
    }

    return (
      <TouchableHighlight onPress={this.openMenu} underlayColor={'transparent'} >
        <Image
          source={require('./img/icon-add.png')}
          style={styles.menuIcon}
        />
      </TouchableHighlight>
    );
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
      title: 'sidemenu',
      icon: require('./img/icon-subject.png'),
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
            renderComposer={this.renderComposer}

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
  composer: {
    flex:1,
    flexDirection: 'row'
  },
  menu: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'red',
  },
  menuIcon: {
    width: 30,
    height: 30,
    opacity:0.5,
    marginTop:5,
    marginLeft:5
  }
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
    setLatestMessage: (channelId, text) =>  dispatch(setLatestMessage(channelId, text)),
  };
}

module.exports = connect(select, actions)(ChatView);
