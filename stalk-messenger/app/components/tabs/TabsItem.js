import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { S5Icon } from 's5-components';

export default class TabsItem extends Component {

  static propTypes = {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    backgroundColor: React.PropTypes.string,
    activeColor: React.PropTypes.string,
    inactiveColor: React.PropTypes.string,
    textStyle: Text.propTypes.style,
    tabStyle: View.propTypes.style,
    renderTab: React.PropTypes.func,
    tabLineStyle: View.propTypes.style,
  };

  static defaultProps = {
    activeColor: 'rgb(59,89,152)',
    inactiveColor: 'rgb(204,204,204)',
    backgroundColor: null,
  };

  constructor(props) {
		super(props);
	}

  renderTab(name, page, isTabActive, onPressHandler) {
    const { activeColor, inactiveColor, textStyle, } = this.props;
    const itemColor = isTabActive ? activeColor : inactiveColor;

    return <TouchableOpacity
      style={{flex: 1, }}
      key={name}
      accessible={true}
      accessibilityLabel={name}
      accessibilityTraits='button'
      onPress={() => onPressHandler(page)}
    >
      <View style={[styles.tab, this.props.tabStyle, ]}>
        <S5Icon name={name} size={30} color={itemColor} />
        {/* <Text style={[{color: textColor, fontSize: 10, fontWeight, }, textStyle, ]}>
          {name}
        </Text> */}
      </View>
    </TouchableOpacity>;
  }

  render() {
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: 4,
      backgroundColor: 'navy',
      //bottom: 0, // Android
      top: 0, // IOS
    };

    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1, ], outputRange: [0,  containerWidth / numberOfTabs, ],
    });

    return (
      <View style={[styles.tabs, this.props.style, ]}>
        {this.props.tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page;
          const renderTab = this.props.renderTab || this.renderTab.bind(this);
          return renderTab(name, page, isTabActive, this.props.goToPage);
        })}
        <Animated.View style={[tabUnderlineStyle, { left, }, this.props.underlineStyle, ]} />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  tabs: {
    backgroundColor: '#FFFFFF',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 0,
    borderTopWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
  },
});
