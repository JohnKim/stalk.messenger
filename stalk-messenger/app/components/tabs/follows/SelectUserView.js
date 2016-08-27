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

import { S5Header, S5SwipeListView } from 's5-components';
import { loadFollows } from 's5-action';
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
  }

  _onRowPress(data, checked ){
    console.log( checked );
    console.log( data );
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
    loadFollows: () => dispatch(loadFollows())
  };
}

module.exports = connect(select, actions)(SelectUserView);