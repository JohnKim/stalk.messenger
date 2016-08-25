/**
 *
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import { connect }  from 'react-redux';
import { signup }   from 's5-action';
import { S5ProfilePicture, S5Button } from 's5-components';

class UserView extends Component {

  static propTypes = {
    navigator: React.PropTypes.any.isRequired,
    user: React.PropTypes.object.isRequired,
  };

  state = {
  };

	constructor(props) {
		super(props);
	}

  componentDidMount() {
    console.log(this.props);
  }

  render() {

    return (
      <View style={styles.container}>

        <TouchableHighlight
          onPress={() => this.props.navigator.pop()}
          style={{
            marginRight:10,
            marginTop:10
          }}
          underlayColor="transparent">
          <Image source={require('../../common/img/ic_close.png')} />
        </TouchableHighlight>

        <View style={styles.form}>

          <Text> 개발 해야 함 !! </Text>
          <S5ProfilePicture
            name={this.props.user.nickName}
            profileFileUrl={this.props.user.profileFileUrl}
            size={100}
          />

        </View>
      </View>
    );

  }

}

var styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  form: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: '#FFFFFF',
    padding: 20,
    // Image's source contains explicit size, but we want
    // it to prefer flex: 1
    width: undefined,
    height: undefined,
  },
});

function actions(dispatch) {
  return {
    signup: (data, callback) => dispatch(signup(data, callback))
  };
}

module.exports = connect(null, actions)(UserView);
