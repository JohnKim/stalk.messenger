import React, { PropTypes, Component } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListView,
} from 'react-native'

import { S5ProfilePicture, S5Icon } from 's5-components';

export default class ControlPanel extends Component {

  static propTypes = {
    closeDrawer: PropTypes.func.isRequired,
    users: PropTypes.any.isRequired
  };

  state = {
    users: this.props.users,
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
  };

  constructor(props){
    super(props);
    this._openAddUserView = this._openAddUserView.bind(this);
    this._leaveChat = this._leaveChat.bind(this);
    this._renderUsers = this._renderUsers.bind(this);
  }

  _openAddUserView() {
    this.props.closeDrawer({openSelectUserView:1});
  }

  _leaveChat() {
    this.props.closeDrawer({leaveChat:1});
  }

  componentDidMount(){
    this.setState({dataSource:this.getDataSource(this.state.users)});
  }

  componentWillReceiveProps (nextProps) {
    this.setState({dataSource:this.getDataSource(nextProps.users)});
  }

  getDataSource(users: Array<any>): ListView.DataSource {
    return this.state.dataSource.cloneWithRows(users);
  }

  _renderRow(user){
    return (
      <View key={user.username} style={styles.item}>
        <S5ProfilePicture
          name={user.nickName}
          profileFileUrl={user.profileFileUrl}
          size={40}
          style={styles.profileImage}
        />
        <Text style={styles.itemText}>
          {user.nickName}
        </Text>
      </View>
    );
  }

  _renderUsers(){

    return (
      <ListView
        ref="listView"
        dataSource={this.state.dataSource}
        removeClippedSubviews={false}
        renderRow={ (data) => this._renderRow(data) }
      />
    );
  }

  render() {

    return (
      <View style={styles.container}>
        <ScrollView >
          <View style={styles.header}>
            <S5Icon name={'close'} color={'grey'} onPress={this.props.closeDrawer}  />
          </View>
          <View style={styles.itemList}>
            <TouchableOpacity onPress={this._openAddUserView}>
              <View style={styles.item}>
                <S5Icon name={'add'} size={40} color={'#02a8f3'} style={styles.imageInvite} />
                <Text style={[styles.itemText,{color:'#02a8f3'}]}>Invite follower</Text>
              </View>
            </TouchableOpacity>
            {this._renderUsers()}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <View >
            <S5Icon name={'log-out'} color={'grey'} onPress={this._leaveChat}>
              <Text style={{color: 'gray'}}> Leave </Text>
            </S5Icon>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderLeftWidth: 1,
    borderLeftColor: 'grey'
  },
  header: {
    paddingTop: 15,
    paddingLeft: 20,
    paddingBottom: 10,
    backgroundColor: '#f8f8f8',
  },
  footer: {
    paddingTop: 2,
    paddingLeft: 20,
    paddingBottom: 2,
    backgroundColor: '#f8f8f8',
  },
  imageInvite: {
    margin:10,
    width:40,
    height:40,
    borderWidth: 1,
    borderRadius:20,
    borderColor:'#02a8f3',
    paddingLeft:10
  },
  profileImage: {
    margin:10,
    width:40,
    height:40
  },
  itemList: {
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  itemText: {
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  }
})
