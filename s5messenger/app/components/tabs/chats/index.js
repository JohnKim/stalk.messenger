/**
 *
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import {
  View,
  Navigator,
  StyleSheet,
  Text,
  ListView,
	TouchableOpacity,
	TouchableHighlight,
} from 'react-native';

import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import ChatCell from './ChatCell';

import { loadChats } from 's5-action';
import { connect } from 'react-redux';

import Header from 'S5Header';

class ChatsScreen extends Component {

  state = {
    listViewData: [],
  };

	constructor(props) {
		super(props);
		this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
	}

  componentDidMount(){
    this.setState({
      listViewData: this.props.chats.list
    });
  }

	deleteRow(secId, rowId, rowMap) {
		rowMap[`${secId}${rowId}`].closeRow();
		const newData = [...this.state.listViewData];
		newData.splice(rowId, 1);
		this.setState({listViewData: newData});
	}

  _onRowPress(user) {
    console.log('_onRowPress', user);
  }

  _onProfileImagePress(user) {
    console.log('_onProfileImagePress', user);
  }

  _renderRow(data) {

    return (
      <ChatCell
        key={data.id}
        user={data}
        onPress={() => this._onRowPress(data)}
        onProfilePress={() => this._onProfileImagePress(data)}
        />
    )
  }

	render() {
		return (
      <View style={styles.container}>

        <Header
          title="Chats"
          style={{backgroundColor: '#224488'}}
        />

        <SwipeListView
						dataSource={this.ds.cloneWithRows(this.state.listViewData)}
						renderRow={ (data) => this._renderRow(data) }
						renderHiddenRow={ (data, secId, rowId, rowMap) => (
							<View style={styles.rowBack}>
								<Text>Left</Text>
								<View style={[styles.backRightBtn, styles.backRightBtnLeft]}>
									<Text style={styles.backTextWhite}>Right</Text>
								</View>
								<TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ _ => this.deleteRow(secId, rowId, rowMap) }>
									<Text style={styles.backTextWhite}>Delete</Text>
								</TouchableOpacity>
							</View>
						)}
						leftOpenValue={75}
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
    loadChats: () => dispatch(loadChats()),
  };
}

module.exports = connect(select, actions)(ChatsScreen);
