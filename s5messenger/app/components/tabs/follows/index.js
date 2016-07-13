/**
 *
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import {
  View,
  Navigator,
  StyleSheet,
  Text,
} from 'react-native';

import { loadFollows } from 's5-action';
import { connect } from 'react-redux';

import Header from 'S5Header';
import RefreshableListView from 'S5RefreshableListView';

class FollowsScreen extends Component {

  constructor(props) {
    super(props);

    //this.state = { };
    this._renderRowView = this._renderRowView.bind(this);
    this.openPostDetail = this.openPostDetail.bind(this);
  }

  _onFetch(page = 1, callback, options) {
    console.log('......................');
        console.log(this.state.user);
            console.log(this.state.follows);

    callback(this.state.follows, {
      allLoaded: true, // the end of the list is reached
    });

  }

  _renderRowView(user) {
    return (
      <View key={user.id}>
        <TouchableHighlight onPress={() => this.openPostDetail(user)}>
          <View style={styles.row}>
            <Text style={styles.rowTitleText}>
              {user.username}
            </Text>
            <Text style={styles.rowDetailText}>
              {user.email}
            </Text>
          </View>
        </TouchableHighlight>
        <View style={styles.separator} />
      </View>
    );
  }

  openPostDetail(post) {
    console.log(post);
  }

  render() {

    const searchItem = {
      title: 'Search',
      icon: require('./img/search.png'),
      onPress: () => alert('Filter button pressed!'),
    };

    return (
      <View style={styles.container}>
        <Header
          title="Follows"
          style={{backgroundColor: '#224488'}}
          rightItem={{...searchItem, layout: 'icon'}}
        />
        <RefreshableListView
          onFetch={this._onFetch}
          rowView={this._renderRowView}
        />
      </View>
    );
  }

}

FollowsScreen.propTypes = {
  user: React.PropTypes.object,
  navigator: React.PropTypes.object, // Navigator
  loadPost: React.PropTypes.func, // (page: number) => Array<Post>
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  }
});

function select(store) {
  return {
    user: store.user,
    follows: store.follows,
  };
}

function actions(dispatch) {
  return {
    loadFollows: () => dispatch(loadFollows()),
  };
}

module.exports = connect(select, actions)(FollowsScreen);
