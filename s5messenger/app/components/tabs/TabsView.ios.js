/**
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import {
  StatusBarIOS,
  TabBarIOS,
  Navigator,
} from 'react-native';

import { switchTab } from 's5-action';
import { connect } from 'react-redux';
import S5Colors from 'S5Colors';

import ProfileView from './profile';
import PostView from './post';
import NotificationView from './notification';

class TabsView extends React.Component {

  componentDidMount() {
    StatusBarIOS && StatusBarIOS.setStyle('light-content');
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
          title="My trips"
          selected={this.props.tab === 'profile'}
          onPress={this.onTabSelect.bind(this, 'profile')}
          icon={require('./profile/img/profile-icon.png')}
          selectedIcon={require('./profile/img/profile-icon-active.png')}>
          <ProfileView navigator={this.props.navigator} />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Trips"
          selected={this.props.tab === 'post'}
          onPress={this.onTabSelect.bind(this, 'post')}
          icon={require('./post/img/post-icon.png')}
          selectedIcon={require('./post/img/post-icon-active.png')}>
          <PostView navigator={this.props.navigator} />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Notifications"
          selected={this.props.tab === 'notification'}
          onPress={this.onTabSelect.bind(this, 'notification')}
          icon={require('./notification/img/notification-icon.png')}
          selectedIcon={require('./notification/img/notification-icon-active.png')}>
          <NotificationView navigator={this.props.navigator} />
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
