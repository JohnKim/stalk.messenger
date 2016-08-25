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
import ActionButton from 'react-native-action-button';

class ChatsScreen extends Component {

  static propTypes = {
    chats: React.PropTypes.object.isRequired,
    messages: React.PropTypes.object.isRequired,
    user: React.PropTypes.object,
    navigator: React.PropTypes.object.isRequired,
    removeChat: React.PropTypes.func.isRequired,
  };

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

    console.log(secId, rowId, rowMap);

		rowMap[`${secId}${rowId}`].closeRow();
    this.props.removeChat(rowId).then((row) => {
      // TODO do something after deleting.
    });

    this.props.removeChat(rowId);
  }

  _openAddUserView() {
  	// TODO Impl this
  }

  _renderRow(chat) {
    return (
      <ChatCell
        key={chat.id}
        chat={chat}
        message={this.props.messages.latest[chat.channelId]}
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
          renderHiddenRow={ (data, secId, rowId, rowMap) => (
            <View style={styles.rowBack}>
              <View style={[styles.backRightBtn, styles.backRightBtnLeft]}>
                <Text style={styles.backTextWhite}>Mark as Read</Text>
              </View>
              <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ () => this._deleteRow(secId, rowId, rowMap) }>
                <Text style={styles.backTextWhite}>Leave</Text>
              </TouchableOpacity>
            </View>
          ) }
          enableEmptySections={true}
          rightOpenValue={-150}
          />

        <ActionButton
          buttonColor="rgba(231,76,60,1)"
          onPress={this._openAddUserView}
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
    messages: store.messages,
  };
}

function actions(dispatch) {
  return {
    loadChats: () => dispatch(loadChats()), // @ TODO not used !!
    removeChat: (rowId) => dispatch(removeChat(rowId)),
  };
}

module.exports = connect(select, actions)(ChatsScreen);
