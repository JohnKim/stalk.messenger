
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { connect }  from 'react-redux';
import { signin }   from 's5-action';
import { S5TextInput, S5Button } from 's5-components';

class SigninView extends Component {

  state = {
    username: '',
    password: '',
  };

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

  render(){
    return (
      <View style={styles.container}>
        <View>

          <S5TextInput
            ref="username"
            style={styles.textinput}
            placeholder={"Username"}
            value={this.state.username}
            autoCapitalize="none"
            onChangeText={(text) => this.setState({username: text.toLowerCase()})}
          />

          <S5TextInput
            ref="password"
            style={styles.textinput}
            placeholder={"Password"}
            value={this.state.password}
            secureTextEntry={true}
            onChangeText={(text) => this.setState({password: text})}
          />

          <Text>
            {this.state.message}
          </Text>

          <S5Button
            caption="Login"
            onPress={this.login.bind(this)}
          />

          <S5Button
            type="secondary"
            caption="New here ?"
            onPress={() => this.props.onSwitchView('Signup')}
          />

        </View>
      </View>
    );
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  textinput: {
    margin: 10,
  }
});

SigninView.propTypes = {
  onSwitchView: React.PropTypes.func.isRequired,
};

function actions(dispatch) {
  return {
    signin: (data, callback) => dispatch(signin(data, callback))
  };
}

module.exports = connect(null, actions)(SigninView);
