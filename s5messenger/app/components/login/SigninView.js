
import React, { Component } from 'react';
import {
  View,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';

import Button from './Button';
import styles from './styles.js';

class SigninView extends Component {

  state = {
    username: '',
    password: '',
  };

  render(){
    return (
      <View style={styles.container}>
        <View style={styles.body}>

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

  login(){

    this.setState({
      loaded: false
    });

    app.authWithPassword({
      "email": this.state.email,
      "password": this.state.password
    }, (error, user_data) => {

      this.setState({
        loaded: true
      });

      if(error){
        alert('Login Failed. Please try again');
      }else{
        AsyncStorage.setItem('user_data', JSON.stringify(user_data));
        this.props.navigator.push({
          component: Account
        });
      }
    });


  }

  goToSignup(){




    this.props.navigator.push({
      component: Signup
    });
  }

}

SigninView.propTypes = {
  onSwitchView: React.PropTypes.func.isRequired,
};

module.exports = connect()(SigninView);
