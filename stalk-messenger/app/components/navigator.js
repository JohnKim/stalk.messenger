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

import LoginScreen    from './login';
import SignupView     from './login/SignupView';

import TabsView       from './tabs/TabsView';
import ChatView       from './tabs/chats/ChatView';
import SearchUserView from './tabs/follows/SearchUserView';
import SelectUserView from './tabs/follows/SelectUserView';
import UserView       from './tabs/follows/UserView';
import SettingForm    from './tabs/profile/SettingForm';

class AppNavigator extends Component {

  _handlers = [];//:

  static propTypes = {
    tab: React.PropTypes.number.isRequired,
    switchTab: React.PropTypes.func.isRequired,
    isLoggedIn: React.PropTypes.bool,
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

    if (!this.props.isLoggedIn) {
      if(route.signupView) {
        return <SignupView navigator={navigator} />;
      }

      return <LoginScreen navigator={navigator} />;
    }

    if(route.searchUserView) { // search user view
      return <SearchUserView navigator={navigator} />;
    } if(route.userView) { // user profile view
      return <UserView navigator={navigator} user={route.user}/>;
    }else if(route.chatView) { // chatting view
      return <ChatView navigator={navigator} chat={route.chat} users={route.users}/>;
    } else if(route.settingForm){
      return <SettingForm navigator={navigator} field={route.field} title={route.title} validLength={route.validLength} />;
    } else if(route.selectUserView){
      return <SelectUserView navigator={navigator} chat={route.chat} callback={route.callback}/>;
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
