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
  TextInput,
} from 'react-native';

import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import FollowCell from './FollowCell';

import { loadFollows, removeFollow, createChat } from 's5-action';
import { connect } from 'react-redux';

import Header from 'S5Header';
import S5SwipeListView from 'S5SwipeListView'

class FollowsScreen extends Component {

  state = {
    listViewData: [],
    filter: '',
  };

	constructor(props) {
		super(props);
		this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
	}

  componentDidMount(){

    /** TEST CODE for Section*/
    var sectionData = {};
    for( var inx = 0 ;inx<this.props.follows.list.length;inx++){

      var firstCh = this.props.follows.list[inx].username.substring(0,1).toUpperCase();
      if( !sectionData[firstCh] ){
        sectionData[firstCh] = [];
      }
      sectionData[firstCh].push( this.props.follows.list[inx] );
    }

    this.setState({
      listViewData: this.props.follows.list,
      sectionData: sectionData
    });
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.follows.list !== this.props.follows.list) {
      var self = this;
      this.setState({
        listViewData: nextProps.follows.list
      });
      this.setState({ filter: '' });
      this.refs['listView']._listView.forceUpdate();
      setTimeout(function(){
        self.refs['listView']._listView.scrollTo({y:0});
      }, 100 );
    }

  }
 
	_deleteRow(secId, rowId, rowMap) {
		rowMap[`${secId}${rowId}`].closeRow();
    this.props.removeFollow(rowId);
	}

  _onRowPress(user) {
    this.props.createChat(user.id).then((chat) => {
        this.props.navigator.push({
          chatView: true,
          chat,
        });
    });
  }

  _onProfileImagePress(user) {
    console.log('_onProfileImagePress', user);
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
    )
  }

	render() {

    const filterText = this.state.filter || '';
    const filterRegex = new RegExp(String(filterText), 'i');
    const filter = (user) => filterRegex.test(user.nickName);

    const rightItem = {
      title: 'search',
      icon: require('./img/search.png'),
      onPress: this._openSearchUserView.bind(this),
    };

    let datasource;
    if( Array.isArray(this.state.listViewData) ){
      datasource = this.ds.cloneWithRows(this.state.listViewData.filter(filter));
    } else{
      // TODO : Need more test
      datasource = this.ds.cloneWithRowsAndSections(this.state.listViewData);
    }

		return (
      <View style={styles.container}>

        <Header
          title="Follows"
          style={{backgroundColor: '#224488'}}
          rightItem={{...rightItem, layout: 'icon'}}
        />

        <View style={styles.searchRow}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="always"
            placeholder="Search..."
            style={[styles.searchTextInput]}
            value={this.state.filter}
            onChangeText={text => this.setState({filter: text})}
          />
        </View>

        <S5SwipeListView
          ref="listView"
          dataSource={ datasource }
          renderRow={ (data) => this._renderRow(data) }
          renderHiddenRow={ (data, secId, rowId, rowMap) => (
            <View style={styles.rowBack}>
              <Text>Left</Text>
              <View style={[styles.backRightBtn, styles.backRightBtnLeft]}>
                <Text style={styles.backTextWhite}>Right</Text>
              </View>
              <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ _ => this._deleteRow(secId, rowId, rowMap) }>
                <Text style={styles.backTextWhite}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          enableEmptySections={true}
          sectionData={this.state.sectionData}
          cellHeight={68} // TODO dynamic
          leftOpenValue={75}
          rightOpenValue={-150}
        />

      </View>

		);
	}

}

FollowsScreen.propTypes = {
  user: React.PropTypes.object,
  navigator: React.PropTypes.object, // Navigator
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
});

function select(store) {
  return {
    user: store.user,
    follows: store.follows,
  };
}

function actions(dispatch) {
  return {
    loadFollows: () => dispatch(loadFollows()), // @ TODO not used !!
    removeFollow: (rowId) => dispatch(removeFollow(rowId)),
    createChat: (id, callback) => dispatch(createChat(id, callback)),
  };
}

module.exports = connect(select, actions)(FollowsScreen);
