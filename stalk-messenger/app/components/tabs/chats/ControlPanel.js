import React, { PropTypes, Component } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListView,
  Image
} from 'react-native'

import { S5ProfilePicture } from 's5-components';

export default class ControlPanel extends Component {
  static propTypes = {
    closeDrawer: PropTypes.func.isRequired,
    chat: PropTypes.any.isRequired
  };

  state = {
    users: this.props.chat.users
  };

  constructor(props){
    super(props);
    this._openAddUserView = this._openAddUserView.bind(this);
    this._renderUsers = this._renderUsers.bind(this);
  }

  _openAddUserView() {
    this.props.navigator.push({selectUserView: 1, users:this.state.users});
  }

  _renderUsers(){
    var userList = this.state.users.map(function(user){
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
    })

    return userList;
  }

  render() {
    let {closeDrawer} = this.props;

    return (
      <View style={styles.container}>
        <ScrollView >
          <View style={styles.header}>
            <Text style={styles.controlText}>User List</Text>
          </View>

          <View style={styles.itemList}>
            <TouchableOpacity onPress={this._openAddUserView}>
              <View style={styles.item}>
                <Image source={require('./img/ic_person_add.png')} style={styles.imageInvite}/>
                <Text style={[styles.itemText,{color:'#02a8f3'}]}>Invite follower</Text>                
              </View>
            </TouchableOpacity>
            {this._renderUsers()}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity onPress={closeDrawer}>
            <Image source={require('./img/ic_chevron_right.png')}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderLeftWidth: 1,
    borderLeftColor: 'black'
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  footer: {
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  controlText: {
    color: 'black',
  },
  button: {
    padding: 10,
    backgroundColor: 'white',
  },
  imageInvite: {
    margin:10,
    width:40,
    height:40,
    borderWidth: 1,
    borderRadius:20,
    borderColor:'#02a8f3'
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
    height: 50,
  },
  itemText: {
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  }
})
