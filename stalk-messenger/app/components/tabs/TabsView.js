/**
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import {
  Image,
  View,
  Platform,
} from 'react-native';

import { connect }    from 'react-redux';
import { switchTab }  from 's5-action';

import TabsItem from './TabsItem';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';

import FollowsView    from './follows';
import ChatsView      from './chats';
import ProfileView    from './profile';

class TabsView extends Component {

  static propTypes = {
    tab: React.PropTypes.number,
    switchTab: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.initialPage = props.tab;
  }

  onTabSelect(tab) {
    this.props.switchTab(tab);
  }

  render() {

    if (Platform.OS === 'ios') {
      return (
        <ScrollableTabView
          initialPage={this.initialPage}
          page={this.props.tab}
          renderTabBar={() => <TabsItem />}
          tabBarPosition={'bottom'}
          locked={true}
          onChangeTab={(data) => this.onTabSelect(data.i)}
          >
          <FollowsView  tabLabel="people"     navigator={this.props.navigator} />
          <ChatsView    tabLabel="chatboxes"  navigator={this.props.navigator} />
          <ProfileView  tabLabel="list"       navigator={this.props.navigator} />
        </ScrollableTabView>
      );

    } else {
      return (
        <ScrollableTabView
          style={{marginTop: 20, }}
          page={this.props.tab}
          renderTabBar={() => <TabsItem />}
          tabBarPosition={'top'}
          locked={true}
          onChangeTab={(data) => this.onTabSelect(data.i)}
          >
          <FollowsView  tabLabel="people"     navigator={this.props.navigator} />
          <ChatsView    tabLabel="chatboxes"  navigator={this.props.navigator} />
          <ProfileView  tabLabel="list"       navigator={this.props.navigator} />
        </ScrollableTabView>
      );
    }

  }

}

function select(store) {
  return {
    tab: store.navigation.tab,
  };
}

function actions(dispatch) {
  return {
    switchTab: (tab) => dispatch(switchTab(tab)),
  };
}

module.exports = connect(select, actions)(TabsView);
