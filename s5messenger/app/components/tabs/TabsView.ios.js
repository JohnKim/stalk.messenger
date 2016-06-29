/**
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import {
  StatusBarIOS,
  TabBarIOS,
  Navigator,
  Text,
} from 'react-native';

import { switchTab } from 's5-action';
import { connect } from 'react-redux';

class TabsView extends Component {

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
      <Text>aaaa
      </Text>
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
