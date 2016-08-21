/**
 *
 * Folder 를 생성/수정하는 Form
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  Image
} from 'react-native';

import { connect } from 'react-redux';
import { S5Header, S5TextInput } from 's5-components';
import { updateUser } from 's5-action';

class SettingForm extends Component {

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired,
    field: React.PropTypes.string,
    title: React.PropTypes.string,
    validLength: React.PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.state = {};
    if( this.props.field ){

      this.state = {
        key : this.props.field,
        value : this.props.user[this.props.field],
        title : this.props.title,
        placeholder: 'Please input ' + this.props.title,
      }
    }

    this.saveSetting = this.saveSetting.bind(this);
    this.renderIcon = this.renderIcon.bind(this);
    this.onPressRemoveButton = this.onPressRemoveButton.bind(this);
  }

  onPressRemoveButton(){
    this.setState({value: ''});
  }

  onChangeText(text){
    if( this.props.validLength && text.length > this.props.validLength ){
      return;
    }
    this.setState({value: text});
  }

  renderIcon(){
    return (
      <TouchableHighlight onPress={this.onPressRemoveButton}
        style={{marginRight:10}} underlayColor="transparent">
        <Image source={require('../../common/img/cancel.png')} />
      </TouchableHighlight>
    )
  }

  renderValidation(){
    if( this.props.validLength && this.props.validLength > 0 ){
      return(
        <Text style={styles.helper}>
        {this.state.value.length}/{this.props.validLength}
        </Text>
      )
    }
  }

  saveSetting() {
    this.props.dispatch(updateUser(this.state.key, this.state.value));
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <S5Header
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

        <View style={styles.wrap}>
          <Text style={styles.label}>
            {this.state.placeholder}
          </Text>
          {this.renderValidation()}
        </View>

        <S5TextInput
          style={styles.textinput}
          placeholder={this.state.placeholder}
          value={this.state.value}
          onChangeText={(text) => this.onChangeText(text) }
          renderContainerIcon={this.renderIcon}
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
  wrap: {
    marginTop: 20,
    marginHorizontal: 10,
    flexDirection: 'row'
  },
  helper:{
    position: 'absolute',
    right:0,
    fontSize:16,
  },
  textinput: {
    margin: 10,
  },
  label:{
    fontSize: 16,
    color:'#3b6bb2'
  }
});

function select(store) {
  return {
    user: store.user
  };
}

module.exports = connect(select)(SettingForm);
