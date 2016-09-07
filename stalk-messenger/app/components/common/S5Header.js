/**
 *
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import {
  Platform,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ToolbarAndroid,
} from 'react-native';

import S5Colors from './S5Colors';
import S5Icon   from './S5Icon';

export const Item = {
  title: React.PropTypes.string,
  icon: React.PropTypes.number,
  layout: React.PropTypes.oneOf(['default', 'icon', 'title']),
  onPress: React.PropTypes.func,
}

class S5HeaderAndroid extends Component {

  render() {
    const {leftItem, rightItem, extraItems} = this.props;
    let actions = [];
    if (rightItem) {
      const {title, icon, layout} = rightItem;
      actions.push({
        icon: layout !== 'title' ? icon : undefined,
        title: title,
        show: 'always',
      });
    }
    if (extraItems) {
      actions = actions.concat(extraItems.map((item) => ({
        title: item.title,
        show: 'never',
      })));
    }

    const textColor = this.props.foreground === 'dark'
      ? S5Colors.darkText
      : 'white';

    let content;
    if (React.Children.count(this.props.children) > 0) {
      content = (
        <View collapsable={false} style={{flex: 1}}>
          {this.props.children}
        </View>
      );
    }

    return (
      <View style={[styles.toolbarContainer, this.props.style]}>
        <ToolbarAndroid
          navIcon={leftItem && leftItem.icon}
          onIconClicked={leftItem && leftItem.onPress}
          title={this.props.title}
          titleColor={textColor}
          subtitleColor={textColor}
          actions={actions}
          onActionSelected={this.handleActionSelected.bind(this)}
          style={styles.toolbar}>
          {content}
        </ToolbarAndroid>
      </View>
    );
  }

  handleActionSelected(position: number) {
    let items = this.props.extraItems || [];
    if (this.props.rightItem) {
      items = [this.props.rightItem, ...items];
    }
    const item = items[position];
    item && item.onPress && item.onPress();
  }
}


class S5HeaderIOS extends Component {

  render() {
    const {leftItem, title, rightItem, foreground} = this.props;
    const titleColor = foreground === 'dark' ? S5Colors.darkText : 'white';
    const itemsColor = foreground === 'dark' ? S5Colors.lightText : 'white';

    const content = React.Children.count(this.props.children) === 0
      ? <Text style={[styles.titleText, {color: titleColor}]}>
          {title}
        </Text>
      : this.props.children;
    return (
      <View style={[styles.header, this.props.style]}>
        <View style={styles.leftItem}>
          <ItemWrapperIOS color={itemsColor} item={leftItem} />
        </View>
        <View
          accessible={true}
          accessibilityLabel={title}
          accessibilityTraits="header"
          style={styles.centerItem}>
          {content}
        </View>
        <View style={styles.rightItem}>
          <ItemWrapperIOS color={itemsColor} item={rightItem} />
        </View>
      </View>
    );
  }

}

class ItemWrapperIOS extends React.Component {

  render() {
    const {item, color} = this.props;
    if (!item) {
      return null;
    }

    let content;
    const {title, icon, layout, onPress} = item;

    if (layout !== 'icon' && title) {
      content = (
        <Text style={[styles.itemText, {color}]}>
          {title.toUpperCase()}
        </Text>
      );
    } else if (icon) {
      //content = <Image source={icon} style={{height:18}}/>;
      content = <S5Icon name={icon} color={color} size={22} />

    }

    return (
      <TouchableOpacity
        accessibilityLabel={title}
        accessibilityTraits="button"
        onPress={onPress}
        style={styles.itemWrapper}>
        {content}
      </TouchableOpacity>
    );
  }
}

var STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : 25;
var HEADER_HEIGHT = Platform.OS === 'ios' ? 44 + STATUS_BAR_HEIGHT : 56 + STATUS_BAR_HEIGHT;

var styles = StyleSheet.create({
  toolbarContainer: {
    paddingTop: STATUS_BAR_HEIGHT,
  },
  toolbar: {
    height: HEADER_HEIGHT - STATUS_BAR_HEIGHT,
  },
  header: {
    backgroundColor: 'transparent',
    paddingTop: STATUS_BAR_HEIGHT,
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  leftItem: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerItem: {
    flex: 2,
    alignItems: 'center',
  },
  rightItem: {
    flex: 1,
    alignItems: 'flex-end',
  },
  itemWrapper: {
    padding: 11,
  },
  itemText: {
    letterSpacing: 1,
    fontSize: 12,
    color: 'white',
  },
});

const Header = Platform.OS === 'ios' ? S5HeaderIOS : S5HeaderAndroid;

Header.height = HEADER_HEIGHT;

Header.propTypes = {
  title: React.PropTypes.string,
  //leftItem: React.PropTypes.instanceof(Item),
  //rightItem: React.PropTypes.instanceof(Item),
  extraItems: React.PropTypes.arrayOf(Item),
  foreground: React.PropTypes.oneOf(['light', 'dark']),
  style: View.propTypes.style,
  children: React.PropTypes.any,
};

module.exports = Header;
