/**
 *
 * @flow
 * @providesModule S5ProfilePicture
 */
'use strict';

import React, { Component } from 'React';
import { View, Image, PixelRatio, TouchableHighlight } from 'react-native';

export default class S5ProfilePicture extends Component {

  onPressProfileImage() {

    if(this.props.onPress === undefined) return nulll;

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
            }}
            >
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

  render() {
    const {size} = this.props;
    const scaledSize = size * PixelRatio.get();
    let uri = "";

    if( this.props.profileImageUrl && this.props.profileImageUrl != null ) {
      uri = this.props.profileImageUrl;
    }

    if(this.props.onPress === undefined){
      return (
        <View>
          <Image
            source={{uri}}
            defaultSource={require('./img/face.png')}
            style={[{
              width: size,
              height: size,
              borderRadius: size / 2,
            },this.props.style]}
          />
        </View>
      );
    }else{
      return (
        <TouchableHighlight onPress={this.onPressProfileImage.bind(this)} underlayColor="transparent">
          <View>
            <Image
              source={{uri}}
              defaultSource={require('./img/face.png')}
              style={[{
                width: size,
                height: size,
                borderRadius: size / 2,
              },this.props.style]}
            />
            {this.renderIcon()}
          </View>
        </TouchableHighlight>
      );
    }
  }
}

S5ProfilePicture.propTypes = {
  size: React.PropTypes.number,
  onPress: React.PropTypes.func.isRequired,
  profileImageUrl: React.PropTypes.string,
};
