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

import ChatCell from './ChatCell';

import { loadChats, removeChat } from 's5-action';
import { S5Header, S5SwipeListView } from 's5-components';
import { connect } from 'react-redux';

class ChatsScreen extends Component {

  state = {
    listViewData: []
  };

	constructor(props) {
		super(props);
	}

  componentDidMount(){
    this.setState({
      listViewData: this.props.chats.list
    });
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.chats.list !== this.props.chats.list) {
      this.setState({
        listViewData: nextProps.chats.list
      });
    }
  }

  _onRowPress(chat) {
    this.props.navigator.push({
      chatView: true,
      chat,
    });
  }

	_deleteRow(secId, rowId, rowMap) {
		rowMap[`${secId}${rowId}`].closeRow();
    this.props.removeChat(rowId).then((row) => {
      // TODO do something after deleting.
    });

    this.props.removeChat(rowId);
	}

  _renderRow(chat) {
    return (
      <ChatCell
        key={chat.id}
        chat={chat}
        onPress={() => this._onRowPress(chat)}
        />
    )
  }

  render() {
	return (
      <View style={styles.container}>

        <S5Header
          title="Chats"
          style={{backgroundColor: '#224488'}}
        />

        <S5SwipeListView
          ref="listView"
          data={this.state.listViewData}
          renderRow={ (data) => this._renderRow(data) }
          renderHiddenRow={ (/*data, secId, rowId, rowMap*/) => (
            <View style={styles.rowBack}>
              <View style={[styles.backRightBtn, styles.backRightBtnLeft]}>
                <Text style={styles.backTextWhite}>Mark as Read</Text>
              </View>
              <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ (secId, rowId, rowMap) => this._deleteRow(secId, rowId, rowMap) }>
                <Text style={styles.backTextWhite}>Leave</Text>
              </TouchableOpacity>
            </View>
          ) }
          enableEmptySections={true}
          rightOpenValue={-150}
          />
      </View>
	);
  }
}

ChatsScreen.propTypes = {
  user: React.PropTypes.object,
  navigator: React.PropTypes.object, // Navigator
  loadPost: React.PropTypes.func, // (page: number) => Array<Post>
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1
	},
	standalone: {
		marginTop: 30,
		marginBottom: 30,
	},
	standaloneRowFront: {
		alignItems: 'center',
		backgroundColor: '#CCC',
		justifyContent: 'center',
		height: 50,
	},
	standaloneRowBack: {
		alignItems: 'center',
		backgroundColor: '#8BC645',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 15
	},
	backTextWhite: {
		color: '#FFF'
	},
	rowFront: {
		alignItems: 'center',
		backgroundColor: '#CCC',
		borderBottomColor: 'black',
		borderBottomWidth: 1,
		justifyContent: 'center',
		height: 50,
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
	controls: {
		alignItems: 'center',
		marginBottom: 30
	},
	switchContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: 5
	},
	switch: {
		alignItems: 'center',
		borderWidth: 1,
		borderColor: 'black',
		paddingVertical: 10,
		width: 100,
	}
});

function select(store) {
  return {
    user: store.user,
    chats: store.chats,
  };
}

function actions(dispatch) {
  return {
    loadChats: () => dispatch(loadChats()), // @ TODO not used !!
    removeChat: (rowId) => dispatch(removeChat(rowId)),
  };
}

module.exports = connect(select, actions)(ChatsScreen);
