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

import { loadFollows, addUsers } from 's5-action';
import { S5Header, S5SwipeListView } from 's5-components';
import { connect } from 'react-redux';


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

    this._onRightItemPress = this._onRightItemPress.bind(this);
    this.checkedUsers = {};
    this.existUserIds = [];

    if( this.props.chat && this.props.chat.users ){
      for( var inx = 0 ; inx < this.props.chat.users.length;inx++ ){
        this.existUserIds.push( this.props.chat.users[inx].username );
      }
    }
  }

  _onRowPress(user, checked ){
    if( checked ){
      this.checkedUsers[user.id] = user;
    } else {
      if( this.checkedUsers[user.id] ) delete this.checkedUsers[user.id];
    }
  }

  _onRightItemPress(){
    if( this.props.chat ){
      this._addUsers();
    } else {
      this._createChat();
    }
  }

  _createChat(){
    var users = [];

    for (var username in this.checkedUsers) {
      users.push(this.checkedUsers[username]);
    }

    if( users.length > 0 ){
      this.props.navigator.replace({
        chatView: true,
        users,
      });
    }
  }

  _addUsers(){
    var users = [];

    for (var prop in this.checkedUsers) {
      users.push(this.checkedUsers[prop].id);
    }

    if( users.length > 0 ){
      this.props.addUsers(this.props.chat.id, this.props.chat.channelId, users).then(
        (result) => {
          console.log('Add users', result);
          // TODO : implement screen refresh logic
        },
        (error)=> {
          console.log('ERROR....>', error);
        });
    }
  }

  _renderRow(data) {

    var disabled = false;
    var checked = false;
    if( this.existUserIds.indexOf( data.username ) > -1 ){
      disabled = true;
      checked = true;
    }

    return (
      <FollowCell
        key={data.id}
        user={data}
        disabled ={disabled}
        checked={checked}
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
            icon: 'arrow-back',
            title: 'Back',
            layout: 'icon',
            onPress: () => this.props.navigator.pop(),
          }}
          rightItem={{
            title: 'Invite',
            icon: 'checkmark-circle-outline',
            layout: 'icon',
            onPress: () => this._onRightItemPress(),
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
    addUsers: (chatId, channelId, ids) => dispatch(addUsers(chatId, channelId, ids)),
  };
}

module.exports = connect(select, actions)(SelectUserView);
