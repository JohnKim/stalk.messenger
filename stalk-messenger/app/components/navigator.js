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

import { connect }    from 'react-redux';
import { switchTab }  from 's5-action';

import TabsView       from './tabs/TabsView';
import ChatView       from './tabs/chats/ChatView';
import SearchUserView from './tabs/follows/SearchUserView';
import SettingForm    from './tabs/profile/SettingForm';
import LoginScreen from './login';

class AppNavigator extends Component {

  _handlers = [];//:

  static propTypes = {
    tab: React.PropTypes.string.isRequired,
    switchTab: React.PropTypes.func.isRequired,
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

    if (this.props.tab !== 'chats') {
      this.props.switchTab('chats');
      return true;
    }
    return false;
  }


  renderScene (route, navigator) {

    if (!this.props.isLoggedIn) {

      if(route.signup) {
        console.log('signup!!!');
      }

      return <LoginScreen navigator={navigator} />;
    }

    if(route.searchUserView) { // search user view
      return <SearchUserView navigator={navigator} />;
    } else if(route.chatView) { // chatting view
      return <ChatView navigator={navigator} chat={route.chat} />;
    } else if(route.settingForm){
      return <SettingForm navigator={navigator} field={route.field} title={route.title} validLength={route.validLength} />;
    }

    return <TabsView navigator={navigator} />;
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

          if (route.settingForm) {
            return Navigator.SceneConfigs.FloatFromBottom;
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
    backgroundColor: 'black',
  },
});

function select(store) {
  return {
    isLoggedIn: store.user.isLoggedIn,
    tab: store.navigation.tab,
  };
}

function actions(dispatch) {
  return {
    switchTab: (tab) => dispatch(switchTab(tab)),
  };
}

module.exports = connect(select, actions)(AppNavigator);
