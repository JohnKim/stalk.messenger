

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
} from 'react-native';

import { connect } from 'react-redux';
import { signup } from 's5-action';

import Button from './Button';
import styles from './styles.js';


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

  		    <TextInput
            ref="email"
    		    style={styles.textinput}
    		    onChangeText={(text) => this.setState({email: text})}
    		    value={this.state.email}
            placeholder={"Email Address"}
  		    />
          <TextInput
            ref="username"
            style={styles.textinput}
            onChangeText={(text) => this.setState({username: text})}
            value={this.state.username}
            placeholder={"Username"}
          />
          <TextInput
            ref="password"
            style={styles.textinput}
            onChangeText={(text) => this.setState({password: text})}
            value={this.state.password}
            secureTextEntry={true}
            placeholder={"Password"}
          />
          <TextInput
            style={styles.textinput}
            onChangeText={(text) => this.setState({passwordChecked: text})}
            value={this.state.passwordChecked}
            secureTextEntry={true}
            placeholder={"Check Password with same"}
          />
          <Text>
            {this.state.message}
          </Text>
          <Button
            text="Signup"
            onpress={this.signup.bind(this)}
            button_styles={styles.primary_button}
            button_text_styles={styles.primary_button_text} />

          <Button
            text="Got an Account?"
            onpress={() => this.props.onSwitchView('Signin')}
            button_styles={styles.transparent_button}
            button_text_styles={styles.transparent_button_text} />
        </View>
      </View>
    );
  }
}

SignupView.propTypes = {
  onSwitchView: React.PropTypes.func.isRequired,
};

function actions(dispatch) {
  return {
    signup: (data, callback) => dispatch(signup(data, callback))
  };
}

module.exports = connect(null ,actions)(SignupView);
