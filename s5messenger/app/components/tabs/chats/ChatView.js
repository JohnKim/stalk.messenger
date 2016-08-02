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

var GiftedMessenger = require('react-native-gifted-messenger');

var STATUS_BAR_HEIGHT = Navigator.NavigationBar.Styles.General.StatusBarHeight;

/* @TODO react-native-extra-dimensions-android 검토 필요.
if (Platform.OS === 'android') {
  var ExtraDimensions = require('react-native-extra-dimensions-android');
  STATUS_BAR_HEIGHT = ExtraDimensions.get('STATUS_BAR_HEIGHT');
} */

class ChatView extends Component {

  constructor(props) {
    super(props);

    console.log('CONST', props);
    this._messages = [];
    //this._messages = this.getInitialMessages();

    this.state = {
      messages: this._messages,
      isLoadingEarlierMessages: false,
      typingMessage: '',
      allLoaded: false,
    };
  }

  componentDidMount() {

    // sample..

    var msg = [{
      text: JSON.stringify(this.props.chat, null, 1),
      name: 'sample test',
      image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
      position: 'left',
      date: new Date(2016, 0, 1, 20, 0),
      uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
    }];

    this.setMessages(msg.concat(this._messages));
  }

  componentWillUnmount() {

  }

  setMessages(messages) {
    this._messages = messages;
    this.setState({ messages: messages });
  }

  setMessageStatus(uniqueId, status) {
    let messages = [];
    let found = false;

    for (let i = 0; i < this._messages.length; i++) {
      if (this._messages[i].uniqueId === uniqueId) {
        let clone = Object.assign({}, this._messages[i]);
        clone.status = status;
        messages.push(clone);
        found = true;
      } else {
        messages.push(this._messages[i]);
      }
    }

    if (found === true) {
      this.setMessages(messages);
    }
  }

  onLoadEarlierMessages() {

    // display a loader until you retrieve the messages from your server
    this.setState({
      isLoadingEarlierMessages: true,
    });

    // Your logic here
    // Eg: Retrieve old messages from your server

    // IMPORTANT
    // Oldest messages have to be at the begining of the array
    var earlierMessages = [
      {
        text: 'React Native enables you to build world-class application experiences on native platforms using a consistent developer experience based on JavaScript and React. https://github.com/facebook/react-native',
        name: 'React-Bot',
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
        position: 'left',
        date: new Date(2016, 0, 1, 20, 0),
        uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
      }, {
        text: 'This is a touchable phone number 0606060606 parsed by taskrabbit/react-native-parsed-text',
        name: 'Awesome Developer',
        image: null,
        position: 'right',
        date: new Date(2016, 0, 2, 12, 0),
        uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
      },
    ];

    setTimeout(() => {
      this.setMessages(earlierMessages.concat(this._messages)); // prepend the earlier messages to your list
      this.setState({
        isLoadingEarlierMessages: false, // hide the loader
        allLoaded: true, // hide the `Load earlier messages` button
      });
    }, 1000); // simulating network

  }

  onImagePress(message = {}) {
    // Your logic here
    // Eg: Navigate to the user profile
  }

  handleSend(message = {}) {

    // Your logic here
    // Send message.text to your server

    message.uniqueId = Math.round(Math.random() * 10000); // simulating server-side unique id generation
    this.setMessages(this._messages.concat(message));

    // mark the sent message as Seen
    setTimeout(() => {
      this.setMessageStatus(message.uniqueId, 'Seen'); // here you can replace 'Seen' by any string you want
    }, 1000);

    // if you couldn't send the message to your server :
    // this.setMessageStatus(message.uniqueId, 'ErrorButton');
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
        <GiftedMessenger

          ref={(c) => this._GiftedMessenger = c}

          styles={{
            bubbleRight: {
              marginLeft: 70,
              backgroundColor: '#007aff',
            },
          }}

          autoFocus={false}
          messages={this.state.messages}
          handleSend={this.handleSend.bind(this)} // Called when a message is Sent
          //onErrorButtonPress={this.onErrorButtonPress.bind(this)} // Called when the re-send button is pressed
          maxHeight={Dimensions.get('window').height - Navigator.NavigationBar.Styles.General.NavBarHeight - STATUS_BAR_HEIGHT}

          loadEarlierMessagesButton={!this.state.allLoaded}
          onLoadEarlierMessages={this.onLoadEarlierMessages.bind(this)}

          senderName='Awesome Developer'
          senderImage={null}
          onImagePress={this.onImagePress.bind(this)}
          displayNames={true}

          parseText={false} // enable handlePhonePress, handleUrlPress and handleEmailPress
          //handlePhonePress={this.handlePhonePress}
          //handleUrlPress={this.handleUrlPress}
          //handleEmailPress={this.handleEmailPress}

          isLoadingEarlierMessages={this.state.isLoadingEarlierMessages}

          typingMessage={this.state.typingMessage}
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
