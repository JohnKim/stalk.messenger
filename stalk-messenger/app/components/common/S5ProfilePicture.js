/**
 *
 * @flow
 */
'use strict';

import React, { Component } from 'React';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
} from 'react-native';
import S5Colors from './S5Colors';

export default class S5ProfilePicture extends Component {

  static propTypes = {
    name: React.PropTypes.any, // string of array
    size: React.PropTypes.number,
    onPress: React.PropTypes.func,
    profileImageUrl: React.PropTypes.string,
    editable: React.PropTypes.bool,
    style: React.PropTypes.any,
  };

  constructor(props) {
    super(props);
  }

  onPressProfileImage() {

    if(this.props.onPress === undefined) return null;

    return this.props.onPress && this.props.onPress();
  }

  renderIcon(){
    const {size} = this.props;
    if(this.props.editable){
      return (
         <View
            style={{
              width: (size / 5 )+10,
              height: (size / 5)+10 ,
              position: 'absolute',
              top: size - ( size / 4 ),
              left: size - ( size / 4 ),
              borderRadius: (size / 5 + 10) / 2,
              alignItems: 'center',
              backgroundColor:'white'
            }} >
            <Image
              source={require('./img/camera.png')}
              style={{
                width: (size / 5 ),
                height: (size / 5),
                opacity:0.5,
                marginTop:5
              }}
            />
          </View>
      )
    }
  }

  renderProfileCircle(){

    const {size} = this.props;

    let uri = "";
    if( this.props.profileImageUrl && this.props.profileImageUrl != null ) {
      uri = this.props.profileImageUrl;
    }

    if( uri ){
      return (
        <Image
          source={{uri}}
          defaultSource={require('./img/face.png')}
          style={[{
            width: size,
            height: size,
            borderRadius: size / 2,
          },this.props.style]}
        />
      );

    }else{

      let name = '';
      if(this.props.name) name = this.props.name.substring(0, 1);

      return (
        <View
          style={[{
            width: size,
            height: size,
            borderRadius: size / 2,
            opacity:0.8,
            backgroundColor: S5Colors.colorForProfile(name)
          },this.props.style]}>
          {/* <Text
            style={{
              color: '#000000'
            }}>{name}</Text> */}
        </View>
      );
    }

  }

  render() {
    if(this.props.onPress === undefined){
      return (
        <View>
          {this.renderProfileCircle()}
        </View>
      );
    }else{
      return (
        <TouchableHighlight onPress={this.onPressProfileImage.bind(this)} underlayColor="transparent">
          <View>
            {this.renderProfileCircle()}
            {this.renderIcon()}
          </View>
        </TouchableHighlight>
      );
    }
  }
}
