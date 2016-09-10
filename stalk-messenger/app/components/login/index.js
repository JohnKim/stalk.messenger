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
} from 'react-native';

import { connect } from 'react-redux';
import { signin }   from 's5-action';
import { S5TextInput, S5Button } from 's5-components';

import KeyboardSpacer from './KeyboardSpacer';

class LoginScreen extends Component {

  static propTypes = {
    signin: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.any.isRequired,
  };

  state = {
    username: '',
    password: '',
  };

  componentDidMount() {
  }

  login(){

    this.setState({ message: '' });
    if(!this.state.username) {
      this.setState({ message: 'Username must be filled' });
      this.refs['username'].focus();
      return false;
    }

    if(!this.state.password) {
      this.setState({ message: 'Password must be filled' });
      this.refs['password'].focus();
      return false;
    }

    this.props.signin( this.state, (error) => {
      if(error.code == 101){ // Invalid username/password
        this.setState({ message: 'Invalid username/password' });
      }
    });
  }

  render() {

    return (
      <View style={[{flex: 1}]}>
        <Image
          style={styles.container}
          source={require('./img/background.png')}>

          <Text
            style={styles.message}>
            {this.state.message}
          </Text>

          <S5TextInput
            ref="username"
            label="USERNAME"
            style={styles.textinput}
            placeholder={''} //{"Username"}
            value={this.state.username}
            autoCapitalize="none"
            onChangeText={(text) => this.setState({username: text.toLowerCase()})}
          />

          <S5TextInput
            ref="password"
            label="PASSWORD"
            style={styles.textinput}
            placeholder={''}//{"Password"}
            value={this.state.password}
            secureTextEntry={true}
            onChangeText={(text) => this.setState({password: text})}
          />

          <S5Button
            style={styles.loginBtn}
            caption="Login"
            onPress={this.login.bind(this)}
          />

          <S5Button
            type="secondary"
            caption="DON'T HAVE AN ACCOUNT ?"
            onPress={() => this.props.navigator.push({signupView: 1})}
          />

        </Image>

        <KeyboardSpacer height={260} style={{backgroundColor: '#FFFFFF'}}/>
      </View>
    );

  }

}

var styles = StyleSheet.create({
  container: {
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
  textinput: {
    marginTop: 20,
  },
  loginBtn: {
    marginTop: 20,
  },
  message: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 13,
    alignSelf: 'center',
  }
});


function actions(dispatch) {
  return {
    signin: (data, callback) => dispatch(signin(data, callback))
  };
}

module.exports = connect(null, actions)(LoginScreen);
