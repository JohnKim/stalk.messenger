/*
 * https://github.com/mortik/react-native-floating-label-text-input/blob/master/index.js
 * @flow
 * @providesModule S5TextInput
*/
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';

var s = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 9,
        backgroundColor: '#fff'
    },
    input: {
        height: 43,
        marginLeft: 10,
        flex: 1
    }

});

export default class S5TextInput extends Component {

  state = {
    borderColor: '#ccc',
  };

  focus() {
    if (this.s5textinput !== null) {
      this.s5textinput.focus();
    }
  }

  _onFocus() {
      let focusBorderColor = this.props.focusBorderColor ? this.props.focusBorderColor : '#0095d9';
      this.setState({borderColor: focusBorderColor});
      if (this.props.onFocus) {
          this.props.onFocus();
      }
  }

  _onBlur() {
      let borderColor = this.props.borderColor ? this.props.borderColor : '#0095d9';
      this.setState({borderColor: borderColor});
      if (this.props.onBlur) {
          this.props.onBlur();
      }
  }

  _renderContainerIcon(){
    if( this.props.renderContainerIcon ){
      return this.props.renderContainerIcon();
    }
  }

  render() {
    return (
        <View style={[s.container,this.state,this.props.style]}>
            <TextInput ref={(ref) => this.s5textinput = ref}
                       style={[s.input|this.props.inputStyle]}
                       onChangeText={this.props.onChangeText}
                       placeholder={this.props.placeholder}
                       secureTextEntry={this.props.secureTextEntry}
                       onFocus={()=>{this._onFocus()}}
                       onBlur={() => {this._onBlur()}}
                       borderColor={this.props.borderColor}
                       focusBorderColor={this.props.focusColor}
                       value={this.props.value}
            />
            {this._renderContainerIcon()}
        </View>
    )
  }

};
