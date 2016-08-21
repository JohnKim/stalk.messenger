/**
 *
 * @flow
 */

'use strict';


import React, { Component } from 'react';
import {
  View,
  Navigator,
  Text,
  StyleSheet,
  TouchableHighlight,
  TextInput,
} from 'react-native';

import { connect } from 'react-redux';
import { searchUsersByPage, createFollow } from 's5-action';
import { S5Header } from 's5-components';

import GiftedListView from 'react-native-gifted-listview';

const PAGE_SIZE = 20;

class SearchUserView extends React.Component {

  state = {
    listViewData: [],
    filter: '',
  };

  constructor(props) {
    super(props);

  }

  _onFetch(page = 1, callback, options) {

    searchUsersByPage(
      {
        keyword: this.state.filter,
        pageNumber: page,
        pageSize: PAGE_SIZE
      }
    , function(err, result){

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

  _onChangeFilterText(text) {
    this.setState(
      (previousState, currentProps) => {
        return {filter: text};
      },
      () => {
        if( this.timeout ) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.refs['listView']._refresh();
        }, 300 );
      }
    )
  }

  _onRowPress(user) {
    this.props.createFollow(user.id).then( () => this.props.navigator.pop() );
  }

  _renderRowView(user) {
    return (
      <View key={user.id}>
        <TouchableHighlight onPress={ () => this._onRowPress(user) }>
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

  render() {

    return (
      <View style={styles.container}>

        <S5Header
          title="Search Users"
          foreground="dark"
          leftItem={{
            icon: require('../../common/img/back.png'),
            title: 'Back',
            layout: 'icon',
            onPress: () => this.props.navigator.pop(),
          }}
        />

        <View style={styles.searchRow}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="always"
            onChangeText={ this._onChangeFilterText.bind(this) }
            placeholder="Search..."
            style={[styles.searchTextInput]}
            testID="explorer_search"
            value={this.state.filter}
          />
        </View>

        <GiftedListView
          ref="listView"
          onFetch={ this._onFetch.bind(this) }
          rowView={ this._renderRowView.bind(this) }
          firstLoader={true} // display a loader for the first fetching
          pagination={true} // enable infinite scrolling using touch to load more
          refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
          withSections={false} // enable sections
          customStyles={{
            paginationView: {
              backgroundColor: '#eee',
            },
          }}

          refreshableTintColor="blue"
        />

      </View>
    );
  }

}

SearchUserView.propTypes = {
  user: React.PropTypes.object,
  navigator: React.PropTypes.object, // Navigator
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

function actions(dispatch) {
  return {
    createFollow: (id) => dispatch(createFollow(id)),
  };
}

module.exports = connect(select, actions)(SearchUserView);
