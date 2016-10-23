/**
 *
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  BackAndroid,
  Navigator,
  StyleSheet,
} from 'react-native';

import TabsView       from './tabs/TabsView';

import ChatView       from './tabs/chats/ChatView';
import SearchUserView from './tabs/follows/SearchUserView';
import SelectUserView from './tabs/follows/SelectUserView';

import Colors from 'S5Colors';

export default class AppNavigator extends Component {

  _handlers = [];//:

  static propTypes = {
    tab: React.PropTypes.number,
  };

  static childContextTypes = {
    addBackButtonListener: React.PropTypes.func,
    removeBackButtonListener: React.PropTypes.func,
  };

	constructor(props) {
		super(props);
	}

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

    if (this.props.tab !== 1) { // "chats tab"
      this.props.switchTab(1);
      return true;
    }
    return false;
  }

  renderScene (route, navigator) {

    console.log(route.name);

    switch (route.name) {
      case 'SearchUserView':
        return <SearchUserView  navigator={navigator} />;
      case 'SelectUserView':
        return <SelectUserView  navigator={navigator} />;
      case 'ChatView':
        return <ChatView        navigator={navigator} chat={route.chat} users={route.users} />;
      default:
        return <TabsView        navigator={navigator} />;
    }

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

          if (route.settingForm || route.selectUserView || route.searchUserView ) {
            return Navigator.SceneConfigs.FloatFromBottom;
          } if (route.userView) {
            return Navigator.SceneConfigs.FloatFromLeft;
          } else {
            return Navigator.SceneConfigs.FloatFromRight;
          }

        }}
        initialRoute={{}}
        renderScene={this.renderScene.bind(this)}
      />
    );
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
