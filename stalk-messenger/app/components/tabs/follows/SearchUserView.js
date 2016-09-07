/**
 *
 * @flow
 */

'use strict';


import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import { connect } from 'react-redux';
import { searchUsersByPage, createFollow } from 's5-action';
import { S5Header, S5EmptyRow, S5TextInput, S5Button } from 's5-components';

import GiftedListView from 'react-native-gifted-listview';
import FollowCell from './FollowCell';

const PAGE_SIZE = 20;

class SearchUserView extends Component {

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    createFollow: React.PropTypes.func.isRequired,
  };

  state = {
    listViewData: [],
    filter: '',
  };

  constructor(props) {
    super(props);

  }

  _onFetch(page = 1, callback /*, options*/) {

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
            statusMessage: user.get('statusMessage'),
            profileFileUrl: user.get('profileFile') ? user.get('profileFile').url() : '',
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
    this.setState( {filter: text}, () => {

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
      <FollowCell
        key={user.id}
        user={user}
        onPress={() => this._onRowPress(user)}
      />
    )
  }

  _renderEmptyRow() {
    return (
      <S5EmptyRow
        text='Insert keywords for searching.'
      />
    )
  }

  _paginationWaitingView(paginateCallback) {
    return (
      <S5Button
        type="secondary"
        caption="LOAD MORE"
        onPress={paginateCallback}
      />
    );
  }

  render() {

    return (
      <View style={styles.container}>

        <S5Header
          title="Search User"
          style={{backgroundColor: '#224488'}}
          leftItem={{
            icon: 'arrow-back',
            title: 'Back',
            layout: 'icon',
            onPress: () => this.props.navigator.pop(),
          }}
        />

        <S5TextInput
          placeholder={' Search...'}
          value={this.state.filter}
          autoCapitalize="none"
          clearButtonMode="always"
          onChangeText={ this._onChangeFilterText.bind(this) }
          inputStyle={{
            paddingLeft: 10
          }}
          testID="explorer_search"
        />

        <GiftedListView
          ref="listView"
          onFetch={ this._onFetch.bind(this) }
          rowView={ this._renderRowView.bind(this) }
          firstLoader={false}   // display a loader for the first fetching
          pagination={true}     // enable infinite scrolling using touch to load more
          refreshable={false}   // enable pull-to-refresh for iOS and touch-to-refresh for Android
          withSections={false}  // enable sections
          enableEmptySections={true}
          emptyView={ this._renderEmptyRow.bind(this) }
          refreshableTintColor="blue"
          paginationWaitingView={ this._paginationWaitingView.bind(this) }
          paginationAllLoadedView={ () => null }
        />

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

function actions(dispatch) {
  return {
    createFollow: (id) => dispatch(createFollow(id)),
  };
}

module.exports = connect(null, actions)(SearchUserView);
