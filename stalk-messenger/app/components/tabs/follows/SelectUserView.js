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
  TextInput,
} from 'react-native';

import FollowCell from './FollowCell';

import { loadFollows, removeFollow, createChat } from 's5-action';
import { S5Header, S5SwipeListView } from 's5-components';
import { connect } from 'react-redux';

class SelectUserView extends Component {
	state = {
		listViewData: [],
		filter: '',
	};

	constructor(props) {
		super(props);
	}

	render(){
		return(
			<View style={styles.container}>

			<S5Header
			  title="Select User"
			  style={{backgroundColor: '#224488'}}
			  leftItem={{
			    icon: require('../../common/img/back_white.png'),
			    title: 'Back',
			    layout: 'icon',
			    onPress: () => this.props.navigator.pop(),
			  }}
			/>
			</View>
      	)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

module.exports = connect()(SelectUserView);