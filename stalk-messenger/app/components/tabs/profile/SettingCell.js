'use strict';

import React, { Component } from 'React';
import { View, Image, Text, TouchableHighlight, StyleSheet } from 'react-native';

export default class SettingCell extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
       <TouchableHighlight onPress={this.props.onPress}
          style={styles.container}
          underlayColor='transparent'>
          <View style={styles.wrap}>
            <Text style={styles.itemLabel}>
              {this.props.label}
            </Text>
            <Text style={styles.text}>
              {this.props.text}
            </Text>
            <Image source={require('./img/icon_arrow_right.png')}
              style={styles.arrow}>
            </Image>
          </View>
        </TouchableHighlight>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 20,
    alignSelf: 'stretch',    
  },
  wrap: {
    flexDirection: 'column',   
  },
  label: {
    fontSize: 16
  },
  text: {
    color:'#3b6bb2'
  },
  arrow: {
    position: 'absolute',
    top: 0,
    right: 0,
    opacity: 0.2
  }
});