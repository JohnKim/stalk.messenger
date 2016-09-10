/**
 *
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import {
  Platform,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ToolbarAndroid,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

const S5Icon = (props) => {

  return <Icon
    name={Platform.OS === 'ios' ? 'ios-'+props.name : 'md-'+props.name}
    size={props.size || 30}
    color={props.color || 'black'}
    style={[{backgroundColor: 'transparent'}, props.style]}
    onPress={props.onPress}
    />;
};

module.exports = S5Icon;
