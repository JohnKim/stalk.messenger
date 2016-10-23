/**
 *
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { TabViewAnimated, TabViewPagerPan, TabBar, TabBarTop } from 'react-native-tab-view';

import S5Colors from 'S5Colors';
import S5Header from 'S5Header';

import FollowsView    from './follows';
import ChatsView      from './chats';
import ProfileView    from './profile';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: S5Colors.primaryDark,
  },
  label: {
    fontSize: 14,
    margin: 5,
  },
  indicator: {
    backgroundColor: '#ffeb3b',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbar: {
    backgroundColor: S5Colors.primary,
    height: 52,
  }
});

export default class TabView extends Component {

  static propTypes = {
    style: View.propTypes.style,
    navigator: PropTypes.object.isRequired,
  };

  state = {
    index: 0,
    routes: [
      { key: 'follows', title: 'Friends', actions: [{ key: 'SearchUserView', icon: 'search' }] },
      { key: 'chats',   title: 'Chats'  , actions: [{ key: 'ChatView', icon: 'add' }] },
      { key: 'profile', title: 'Profile' },
    ],
    actions: [],
  };

  componentWillMount() {
    /* set initial tab */
    let index = 0;
    this._handleChangeTab(index);
  }

  _handleChangeTab = (index) => {

    console.log(index);
    this.setState({
      index,
      actions: this.state.routes[index].actions,
    });
  };

  _renderLabel = ({ navigationState }: any) => ({ route, index }) => {
    return (
      <Text style={[ styles.label, {
        color:      navigationState.index === index ? S5Colors.primaryText : S5Colors.secondaryText,
        fontWeight: navigationState.index === index ? 'bold' : 'normal',
      } ]}>
        {route.title}
      </Text>
    );
  };

  /* FOR ANDROID */
  _renderHeader = (props) => {
    return (
      <TabBarTop
        {...props}
        renderLabel={this._renderLabel(props)}
        indicatorStyle={styles.indicator}
        style={styles.tabbar}
      />
    );
  };

  /* FOR IOS */
  _renderFooter = (props) => {
    return (
      <TabBar
        {...props}
        renderLabel={this._renderLabel(props)}
        style={styles.tabbar}
      />
    );
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
      case 'follows':
        return <FollowsView navigator={this.props.navigator} />;
      case 'chats':
        return <ChatsView   navigator={this.props.navigator} />;
      case 'profile':
        return <ProfileView navigator={this.props.navigator} />;
      default:
        return null;
    }
  };

  _renderPager = (props) => {
    return <TabViewPagerPan {...props} swipeEnabled={true} />;
  };

  _configureTransition = () => null;

  _onPressHeader = (name) => {
    this.props.navigator.push({name});
  }

  render() {

    return (
      <View style={{ flex: 1, backgroundColor: S5Colors.background, }}>

      <S5Header
        title="STALK"
        rightItem={ this.state.actions }
        onPress={ this._onPressHeader }
      />


        {Platform.OS == 'android' ? /* FOR ANDROID */ (

          <TabViewAnimated
            style={[ styles.container, this.props.style ]}
            navigationState={this.state}
            configureTransition={this._configureTransition}
            renderPager={this._renderPager}
            renderScene={this._renderScene}
            renderHeader={this._renderHeader}
            onRequestChangeTab={this._handleChangeTab}
          />

        ) : /* FOR IOS */ (

          <TabViewAnimated
            style={[ styles.container, this.props.style ]}
            navigationState={this.state}
            configureTransition={this._configureTransition}
            renderPager={this._renderPager}
            renderScene={this._renderScene}
            renderFooter={this._renderFooter}
            onRequestChangeTab={this._handleChangeTab}
          />

        )}

      </View>
    );
  }
}
