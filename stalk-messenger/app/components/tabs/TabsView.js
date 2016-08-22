/**
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import {
  Image,
} from 'react-native';

import { connect }    from 'react-redux';
import { switchTab }  from 's5-action';
import TabNavigator   from 'react-native-tab-navigator';

import FollowsView    from './follows';
import ChatsView      from './chats';
import ProfileView    from './profile';

class TabsView extends Component {

  static propTypes = {
    tab:  React.PropTypes.string,
    onTabSelect: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired,
  };

  componentDidMount() {
  }

  onTabSelect(tab) {
    if (this.props.tab !== tab) {
      this.props.onTabSelect(tab);
    }
  }

  render() {

    return (
      <TabNavigator>

        <TabNavigator.Item
          title="Follows"
          selected={this.props.tab === 'follows'}
          renderIcon={() => <Image source={require('./follows/img/icon.png')} />}
          renderSelectedIcon={() => <Image source={require('./follows/img/icon-active.png')} />}
          onPress={() => this.onTabSelect('follows')}>
          <FollowsView navigator={this.props.navigator} />
        </TabNavigator.Item>

        <TabNavigator.Item
          title="Chats"
          selected={this.props.tab === 'chats'}
          renderIcon={() => <Image source={require('./chats/img/icon.png')} />}
          renderSelectedIcon={() => <Image source={require('./chats/img/icon-active.png')} />}
          badgeText="1" // TODO implements !!
          onPress={() => this.onTabSelect('chats')}>
          <ChatsView navigator={this.props.navigator} />
        </TabNavigator.Item>

        <TabNavigator.Item
          title="Profile"
          selected={this.props.tab === 'profile'}
          renderIcon={() => <Image source={require('./profile/img/icon.png')} />}
          renderSelectedIcon={() => <Image source={require('./profile/img/icon-active.png')} />}
          onPress={() => this.onTabSelect('profile')}>
          <ProfileView navigator={this.props.navigator} />
        </TabNavigator.Item>

      </TabNavigator>
    );
  }

}

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
