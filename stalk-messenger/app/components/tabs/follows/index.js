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
} from 'react-native';

import FollowCell from './FollowCell';

import { loadFollows, removeFollow } from 's5-action';
import { S5Header, S5SwipeListView, S5TextInput } from 's5-components';
import { connect } from 'react-redux';

class FollowsScreen extends Component {

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    follows:  React.PropTypes.object.isRequired,
    removeFollow: React.PropTypes.func.isRequired,
  };

  state = {
    listViewData: this.props.follows.list,
    filter: '',
  };

	constructor(props) {
		super(props);
	}

  componentWillReceiveProps (nextProps) {
    if (nextProps.follows.list !== this.props.follows.list) {
      var self = this;

      // TODO : reder가 안되는 경우가 있는데, 이건 SwipeListView 의 문제인 것 같아요..
      this.setState({
        listViewData: nextProps.follows.list
      });

      setTimeout(function(){
        self.setState({ filter: '' });
        self.refs['listView']._listView.scrollTo({y:0});
      }, 100 );
    }

  }

	_deleteRow(secId, rowId, rowMap) {
		rowMap[`${secId}${rowId}`].closeRow();
    this.props.removeFollow(rowId);
	}

  _onRowPress(user) {
    this.props.navigator.push({
      chatView: true,
      users: [user]
    });
  }

  _onProfileImagePress(user) {
    this.props.navigator.push({
      userView: 1,
      user,
    });
  }

  _openSearchUserView() {
    this.props.navigator.push({searchUserView: 1});
  }

  _renderRow(data) {
    return (
      <FollowCell
        key={data.id}
        user={data}
        onPress={() => this._onRowPress(data)}
        onProfilePress={() => this._onProfileImagePress(data)}
      />
    );
  }

	render() {

    const filterText = this.state.filter || '';
    const filterRegex = new RegExp(String(filterText), 'i');
    const filter = (user) => filterRegex.test(user.nickName);

    const rightItem = {
      title: 'search',
      icon: 'search',
      onPress: this._openSearchUserView.bind(this),
    };

		return (
      <View style={styles.container}>

        <S5Header
          title="Follows"
          style={{backgroundColor: '#224488'}}
          rightItem={{...rightItem, layout: 'icon'}}
        />

        <S5TextInput
          placeholder={' Search...'}
          value={this.state.filter}
          autoCapitalize="none"
          onChangeText={text => this.setState({filter: text})}
          inputStyle={{
            paddingLeft: 10
          }}
        />

        <S5SwipeListView
          ref="listView"
          data={ this.state.listViewData.filter(filter) }
          renderRow={ (data) => this._renderRow(data) }
          renderHiddenRow={ (data, secId, rowId, rowMap) => (
            <View style={styles.rowBack}>
              <Text>Left</Text>
              <View style={[styles.backRightBtn, styles.backRightBtnLeft]}>
                <Text style={styles.backTextWhite}>Right</Text>
              </View>
              <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ () => this._deleteRow(secId, rowId, rowMap) }>
                <Text style={styles.backTextWhite}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          enableEmptySections={true}
          sectionKey="nickName"
          autoSection={true}
          leftOpenValue={75}
          rightOpenValue={-150}
          removeClippedSubviews={false}
        />

      </View>

		);
	}

}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1
	},
	backTextWhite: {
		color: '#FFF'
	},
	rowBack: {
		alignItems: 'center',
		backgroundColor: '#DDD',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 15,
	},
	backRightBtn: {
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		width: 75
	},
	backRightBtnLeft: {
		backgroundColor: 'blue',
		right: 75
	},
	backRightBtnRight: {
		backgroundColor: 'red',
		right: 0
	},
});

function select(store) {
  return {
    follows: store.follows,
  };
}

function actions(dispatch) {
  return {
    loadFollows: () => dispatch(loadFollows()), // @ TODO not used !!
    removeFollow: (rowId) => dispatch(removeFollow(rowId)),
  };
}

module.exports = connect(select, actions)(FollowsScreen);
