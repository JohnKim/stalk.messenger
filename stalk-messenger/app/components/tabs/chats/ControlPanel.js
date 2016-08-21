import React, { PropTypes, Component } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListView
} from 'react-native'

import ProfilePicture from 'S5ProfilePicture';

export default class ControlPanel extends Component {
  static propTypes = {
    closeDrawer: PropTypes.func.isRequired
  };

   constructor(props){
    super(props);
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
            {this.props.chat.users.map(user => (
              <View style={styles.item}>
                <ProfilePicture
                  profileImageUrl={user.profileImage}
                  size={40}
                  style={styles.image}
                />              
                <Text style={styles.itemText}>
                  {user.username}
                </Text>
              </View>
            ))}            
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={closeDrawer}>
          <Text>Close Drawer</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black'
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  controlText: {
    color: 'black',
  },
  button: {
    padding: 20,
    backgroundColor: 'white',
  },
  image: {
    margin:10
  },
  itemList: {
    padding: 20,
    flex: 1
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    height: 60,
  },
  itemText: {
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  }
})