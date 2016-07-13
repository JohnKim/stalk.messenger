/**
 *
 * @flow
 */

'use strict';


import React, { Component } from 'react';
import {
  View,
  Navigator,
  Text
} from 'react-native';

import { searchUsersByPage } from 's5-action';
import { connect } from 'react-redux';

import Header from 'S5Header';
import RefreshableListView from 'S5RefreshableListView';

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

  _renderTextInput(): ?ReactElement<any> {
    if (this.props.disableSearch) {
      return null;
    }
    return (
      <View style={styles.searchRow}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          onChangeText={text => {
            this.setState({filter: text});
          }}
          placeholder="Search..."
          style={[styles.searchTextInput]}
          testID="explorer_search"
          value={this.state.filter}
        />
      </View>
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
        {this._renderTextInput()}
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
  },
  searchRow: {
    backgroundColor: '#eeeeee',
    padding: 10,
  },
  searchTextInput: {
    backgroundColor: 'white',
    borderColor: '#cccccc',
    borderRadius: 3,
    borderWidth: 1,
    paddingLeft: 8,
    height: 35,
  },
  row: {
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#bbbbbb',
    marginLeft: 15,
  },
  rowTitleText: {
    fontSize: 17,
    fontWeight: '500',
  },
  rowDetailText: {
    fontSize: 15,
    color: '#888888',
    lineHeight: 20,
  },
});

function select(store) {
  return {
    user: store.user,
  };
}

module.exports = connect(select)(SearchUserView);
