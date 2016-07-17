/**
 *
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  StyleSheet,
  PixelRatio,
} from 'react-native';

export default class FollowCell extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
    };
  }

  render() {

    if(this.props.onProfilePress) {

      return (

          <View style={styles.container}>
            <TouchableHighlight onPress={this.props.onPress} >
              <Image source={{uri: this.state.user.profileImage}}
                style={styles.image} />
            </TouchableHighlight>
            <TouchableHighlight onPress={this.props.onProfilePress} >
              <View style={styles.makerDetailsContainer}>
                  <Text style={styles.makerTitle}>
                    {this.state.user.nickName}
                  </Text>
                <Text style={styles.makerDetails}>
                  {this.state.user.username}
                </Text>
              </View>
            </TouchableHighlight>
          </View>

      );

    } else {

      return (
        <TouchableHighlight onPress={this.props.onPress} >
          <View style={styles.container}>
              <Image source={{uri: this.state.user.profileImage}}
                style={styles.image} />
            <View style={styles.makerDetailsContainer}>
                <Text style={styles.makerTitle}>
                  {this.state.user.nickName}
                </Text>
              <Text style={styles.makerDetails}>
                {this.state.user.username}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      );

    }


  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFD',
  },
  image: {
    height: 48,
    width: 48,
    borderRadius: 25,
    marginTop: 10,
    marginRight: 15,
    marginLeft: 15,
    marginBottom:15,
  },
  makerDetailsContainer: {
    flex: 1,
    marginRight: 10,
  },
  makerTitle: {
    fontSize: 15,
    marginTop: 10,
    marginBottom: 5,
    color: '#DA552F'
  },
  makerDetails: {
    fontSize: 12,
    marginBottom: 5,
    color: 'gray'
  },
  line:{
    marginLeft: 12,
    backgroundColor: '#cccccc',
    height:1 / PixelRatio.get(),
  }
})
