/**
 *
 * Folder 를 생성/수정하는 Form
 */

import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableHighlight,
  Platform,
  StatusBar,
  TextInput,
  Text,
} from 'react-native';

import { connect } from 'react-redux';

import Header from 'S5Header';
import S5TextInput from 'S5TextInput';
import { updateUser } from 's5-action';

class SettingForm extends Component {

  constructor(props) {
    super(props);

    this.state = {};
    if( this.props.field ){

      this.state = {
        key : this.props.field,
        value : this.props.user[this.props.field],
        title : this.props.field,
        placeholder: this.props.field
      }
    }

    this.saveSetting = this.saveSetting.bind(this);

  };

  onChangeText(text){
    this.setState({value: text});
  }

  saveSetting() {
    this.props.dispatch(updateUser(this.state.key, this.state.value));
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          title={this.state.title}
          style={{backgroundColor: '#224488'}}
          leftItem={{
            icon: require('../../common/img/back_white.png'),
            title: 'Back',
            layout: 'icon',
            onPress: () => this.props.navigator.pop(),
          }}
          rightItem={{
            title: 'Save',
            onPress: this.saveSetting.bind(this),
          }}
        />

        <S5TextInput
          style={styles.textinput}
          placeholder={this.state.placeholder}
          value={this.state.value}
          onChangeText={(text) => this.onChangeText(text)}
        />
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  textinput: {
    margin: 10,
  }
});

function select(store) {
  return {
    user: store.user
  };
}

module.exports = connect(select)(SettingForm);