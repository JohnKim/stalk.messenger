

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { signup } from 's5-action';
import S5Button from 'S5Button';
import S5TextInput  from 'S5TextInput';

class SignupView extends Component {

  state = {
    email: '',
    username: '',
    password: '',
    passwordChecked: '',
    message: '',
  };

  signup(){

    this.setState({ message: '' });

    if(!this.state.email) {
      this.setState({ message: 'Email must be filled' });
      this.refs['email'].focus();
      return false;
    }

    if(!this.state.username) {
      this.setState({ message: 'Username must be filled' });
      this.refs['username'].focus();
      return false;
    }

    if(!this.state.password) {
      this.setState({
        message: 'Password must be filled' ,
        passwordChecked: '',
      });
      this.refs['password'].focus();
      return false;
    }

    if(this.state.passwordChecked != this.state.password) {
      this.setState({
        message: 'Both passwords must be same with',
        password: '',
        passwordChecked: '',
      });
      return false;
    }

    this.props.signup( this.state, (error) => {
      if(error.code == 202){ // 202 Account already exists for this username.
        this.setState({ message: 'Account already exists for this username.' });
      }
    });

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.body}>

  		    <S5TextInput
            ref="email"
    		    style={styles.textinput}
    		    onChangeText={(text) => this.setState({email: text.toLowerCase()})}
    		    value={this.state.email}
            autoCapitalize="none"
            placeholder={"Email Address"}
  		    />
          <S5TextInput
            ref="username"
            style={styles.textinput}
            onChangeText={(text) => this.setState({username: text.toLowerCase()})}
            value={this.state.username}
            autoCapitalize="none"
            placeholder={"Username"}
          />
          <S5TextInput
            ref="password"
            style={styles.textinput}
            onChangeText={(text) => this.setState({password: text})}
            value={this.state.password}
            secureTextEntry={true}
            placeholder={"Password"}
          />
          <S5TextInput
            style={styles.textinput}
            onChangeText={(text) => this.setState({passwordChecked: text})}
            value={this.state.passwordChecked}
            secureTextEntry={true}
            placeholder={"Check Password with same"}
          />
          <Text>
            {this.state.message}
          </Text>

          <S5Button
            caption="Sign Up"
            onPress={this.signup.bind(this)}
          />

          <S5Button
            type="secondary"
            caption="Got an Account ?"
            onPress={() => this.props.onSwitchView('Signin')}
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

SignupView.propTypes = {
  onSwitchView: React.PropTypes.func.isRequired,
};

function actions(dispatch) {
  return {
    signup: (data, callback) => dispatch(signup(data, callback))
  };
}

module.exports = connect(null ,actions)(SignupView);
