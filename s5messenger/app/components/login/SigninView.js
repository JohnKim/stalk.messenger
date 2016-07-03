
import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
} from 'react-native';

import { connect } from 'react-redux';
import { signin } from 's5-action';

import Button from './Button';
import styles from './styles.js';

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
      this.setState({
        message: 'Password must be filled' ,
        passwordChecked: '',
      });
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
        <View style={styles.body}>

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
          <Text>
            {this.state.message}
          </Text>

          <Button
            text="Login"
            onpress={this.login.bind(this)}
            button_styles={styles.primary_button}
            button_text_styles={styles.primary_button_text} />

          <Button
            text="New here?"
            onpress={() => this.props.onSwitchView('Signup')}
            button_styles={styles.transparent_button}
            button_text_styles={styles.transparent_button_text} />

        </View>
      </View>
    );
  }

}

SigninView.propTypes = {
  onSwitchView: React.PropTypes.func.isRequired,
};

function actions(dispatch) {
  return {
    signin: (data, callback) => dispatch(signin(data, callback))
  };
}

module.exports = connect(null, actions)(SigninView);
