

import React, { Component } from 'react';
import {
  View,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';

import Button from './Button';
import styles from './styles.js';


class SignupView extends Component {

  state = {
    email: '',
    username: '',
    password: '',
  };

  signup(){

    this.setState({
      loaded: false
    });

    app.createUser({
      'email': this.state.email,
      'password': this.state.password
    }, (error, userData) => {

      if(error){
        switch(error.code){

          case "EMAIL_TAKEN":
            alert("The new user account cannot be created because the email is already in use.");
          break;

          case "INVALID_EMAIL":
            alert("The specified email is not a valid email.");
          break;

          default:
            alert("Error creating user:");
        }

      }else{
        alert('Your account was created!');
      }

      this.setState({
        email: '',
        password: '',
        loaded: true
      });

    });

  }

  goToLogin(){
    this.props.navigator.push({
      component: Login
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.body}>

  		    <TextInput
    		    style={styles.textinput}
    		    onChangeText={(text) => this.setState({email: text})}
    		    value={this.state.email}
            placeholder={"Email Address"}
  		    />
          <TextInput
            style={styles.textinput}
            onChangeText={(text) => this.setState({username: text})}
            value={this.state.username}
            placeholder={"Username"}
          />
          <TextInput
            style={styles.textinput}
            onChangeText={(text) => this.setState({password: text})}
            value={this.state.password}
            secureTextEntry={true}
            placeholder={"Password"}
          />
          <Button
            text="Signup"
            onpress={this.signup.bind(this)}
            button_styles={styles.primary_button}
            button_text_styles={styles.primary_button_text} />

          <Button
            text="Got an Account?"
            onpress={this.goToLogin.bind(this)}
            button_styles={styles.transparent_button}
            button_text_styles={styles.transparent_button_text} />
        </View>
      </View>
    );
  }
}


module.exports = connect()(SignupView);
