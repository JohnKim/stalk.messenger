/**
 *
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ListView
} from 'react-native';

import FollowCell from './FollowCell';

import { loadFollows, createChat } from 's5-action';
import { S5Header, S5SwipeListView } from 's5-components';
import { connect } from 'react-redux';

var checkedUsers = [];

class SelectUserView extends Component {
  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (prev, next) => prev !== next
    }),
    listViewData: this.props.follows.list,
    filter: '',
  };

  constructor(props) {
    super(props);

    this._createChat = this._createChat.bind(this);
  }

  _onRowPress(user, checked ){
    if( checked ){
      checkedUsers.push( user.id );
    } else {
      if( checkedUsers.length > 0 ){
        var inx = checkedUsers.indexOf( user.id );
        if( inx >= 0 ){
          checkedUsers.splice( inx, 1 );
        }
      }
    }
  }

  _createChat(){
    if( checkedUsers.length > 0 ){
      this.props.createChat(checkedUsers).then((chat) => {
        this.props.navigator.replace({
          chatView: true,
          chat,
        });
      });
    }
  }

  _renderRow(data) {
    return (
      <FollowCell
        key={data.id}
        user={data}
        onPress={(checked) => this._onRowPress(data, checked)}
        selectable={true}
      />
    );
  }

  render(){

    const filterText = this.state.filter || '';
    const filterRegex = new RegExp(String(filterText), 'i');
    const filter = (user) => filterRegex.test(user.nickName);

    return(
      <View style={styles.container}>

        <S5Header
          title="Select User"
          style={{backgroundColor: '#224488'}}
          leftItem={{
            icon: require('../../common/img/back_white.png'),
            title: 'Back',
            layout: 'icon',
            onPress: () => this.props.navigator.pop(),
          }}
          rightItem={{
            title: 'Invite',
            onPress: () => this._createChat(),
          }}
        />

        <S5SwipeListView
          ref="listView"
          data={ this.state.listViewData.filter(filter) }
          renderRow={ (data) => this._renderRow(data) }
          enableEmptySections={true}
          sectionKey="username"
          autoSection={true}
        />        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

function select(store) {
  return {
    follows: store.follows,
  };
}

function actions(dispatch) {
  return {
    loadFollows: () => dispatch(loadFollows()),
    createChat: (id, callback) => dispatch(createChat(id, callback)),
  };
}

module.exports = connect(select, actions)(SelectUserView);