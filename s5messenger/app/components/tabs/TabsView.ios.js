/**
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import {
  TabBarIOS,
  Navigator,
  Text,
} from 'react-native';

import S5Colors from 'S5Colors';
import { switchTab } from 's5-action';
import { connect } from 'react-redux';

import FriendsView from './friends';
import ChatsView from './chats';
import ProfileView from './profile';

class TabsView extends Component {

  componentDidMount() {
  }

  onTabSelect(tab) {
    if (this.props.tab !== tab) {
      this.props.onTabSelect(tab);
    }
  }

  render() {

    return (
      <TabBarIOS tintColor={S5Colors.darkText}>
        <TabBarIOS.Item
          title="Friends"
          selected={this.props.tab === 'friends'}
          onPress={this.onTabSelect.bind(this, 'friends')}
          icon={require('./friends/img/icon.png')}
          selectedIcon={require('./friends/img/icon-active.png')}>
          <FriendsView navigator={this.props.navigator} />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Chats"
          selected={this.props.tab === 'chats'}
          onPress={this.onTabSelect.bind(this, 'chats')}
          icon={require('./chats/img/icon.png')}
          selectedIcon={require('./chats/img/icon-active.png')}>
          <ChatsView navigator={this.props.navigator} />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Profile"
          selected={this.props.tab === 'profile'}
          onPress={this.onTabSelect.bind(this, 'profile')}
          icon={require('./profile/img/icon.png')}
          selectedIcon={require('./profile/img/icon-active.png')}>
          <ProfileView navigator={this.props.navigator} />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }

}

TabsView.propTypes = {
  tab:  React.PropTypes.string, // Tab
  onTabSelect: React.PropTypes.func, // (tab: Tab) => void
  navigator: React.PropTypes.object, // Navigator
};

function select(store) {
  return {
    tab: store.navigation.tab,
  };
}

function actions(dispatch) {
  return {
    onTabSelect: (tab) => dispatch(switchTab(tab)),
  };
}

module.exports = connect(select, actions)(TabsView);
