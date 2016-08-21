/**
 *
 * @flow
 */

'use strict';

/* import modules *************************************************************/
import React, { Component } from 'react';
import {
  Platform,
  BackAndroid,
  Navigator,
  StyleSheet,
} from 'react-native';

import { connect } from 'react-redux';
import { switchTab } from 's5-action';

import TabsView from './tabs/TabsView';
import ChatView from './tabs/chats/ChatView';
import SearchUserView from './tabs/follows/SearchUserView';
import SettingForm from './tabs/profile/SettingForm';

class AppNavigator extends Component {

  _handlers = [];//:

  static childContextTypes = {
    addBackButtonListener: React.PropTypes.func,
    removeBackButtonListener: React.PropTypes.func,
  };

  getChildContext() {
    return {
      addBackButtonListener: this.addBackButtonListener,
      removeBackButtonListener: this.removeBackButtonListener,
    };
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  addBackButtonListener = (listener) => {
    this._handlers.push(listener);
  }

  removeBackButtonListener = (listener) => {
    this._handlers = this._handlers.filter((handler) => handler !== listener);
  }

  handleBackButton = () => {
    for (let i = this._handlers.length - 1; i >= 0; i--) {
      if (this._handlers[i]()) {
        return true;
      }
    }

    const {navigator} = this.refs;
    if (navigator && navigator.getCurrentRoutes().length > 1) {
      navigator.pop();
      return true;
    }

    if (this.props.tab !== 'chats') {
      this.props.dispatch(switchTab('chats'));
      return true;
    }
    return false;
  }

  render() {
    return (
      <Navigator
        ref="navigator"
        style={styles.container}
        configureScene={(route) => {
          if (Platform.OS === 'android') {
            return Navigator.SceneConfigs.FloatFromBottomAndroid;
          }
          // TODO: Proper scene support
          if (route.shareSettings || route.follow) {
            return Navigator.SceneConfigs.FloatFromRight;
          } else {
            return Navigator.SceneConfigs.FloatFromBottom;
          }
        }}
        initialRoute={{}}
        renderScene={this.renderScene}
      />
    );
  }

  renderScene = (route, navigator) => {

    if(route.searchUserView) { // search user view
      return <SearchUserView navigator={navigator} />;
    } else if(route.chatView) { // chatting view
      return <ChatView navigator={navigator} chat={route.chat} />;
    } else if(route.settingForm){
      return <SettingForm navigator={navigator} field={route.field} title={route.title} validLength={route.validLength} />;
    }
    return <TabsView navigator={navigator} />;
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

function select(store) {
  return {
    tab: store.navigation.tab,
  };
}

module.exports = connect(select)(AppNavigator);
