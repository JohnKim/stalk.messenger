/**
 *
 * @flow
 */

'use strict';


import React, { Component } from 'react';
import {
  View,
  Navigator,
} from 'react-native';

import { searchUsersByPage } from 's5-action';
import { connect } from 'react-redux';

import { Text } from 'S5Text';
import Header from 'S5Header';
import RefreshableListView from 'S5RefreshableListView';
import UserCell from './UserCell';

var StyleSheet = require('S5StyleSheet');

const PAGE_SIZE = 20;

class SearchUserView extends React.Component {

  constructor(props) {
    super(props);

    this.state = { };

    this._onFetch       = this._onFetch.bind(this);
    this._renderRowView = this._renderRowView.bind(this);
    this.openPostDetail = this.openPostDetail.bind(this);
  }

  _onFetch(page = 1, callback, options) {

    searchUsersByPage(page)
      .then(function(result){

        let rows = result.map( (user) => {
          return {
            id: user.id,
            username: user.get('username'),
            email: user.get('email'),
            nickName: user.get('nickName'),
            profileImage: user.get('profileImage')
          };
        });

        if(rows.length < PAGE_SIZE){
          callback(rows, {
            allLoaded: true, // the end of the list is reached
          });
        } else {
          callback(rows);
        }
      });

  }

  _renderRowView(post) {
    return (
      <UserCell
        key={post.id}
        post={post}
        onPress={() => this.openPostDetail(post)}
      />
    );
  }

  openPostDetail(post) {
    console.log(post);
  }
  render() {

    return (
      <View style={styles.container}>
        <Header
          style={{backgroundColor: '#224488'}}
          title="Search Users"
          leftItem={{
            icon: require('../../../common/img/back.png'),
            title: 'Back',
            layout: 'icon',
            onPress: () => this.props.navigator.pop(),
          }}
        />

        <RefreshableListView
          onFetch={this._onFetch}
          rowView={this._renderRowView}
        />

      </View>
    );
  }

}

SearchUserView.propTypes = {
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
  };
}

module.exports = connect(select)(SearchUserView);
