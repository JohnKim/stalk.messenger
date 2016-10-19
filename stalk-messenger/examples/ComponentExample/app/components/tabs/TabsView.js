import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { TabViewAnimated, TabViewPagerPan, TabBar, TabBarTop } from 'react-native-tab-view';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBarButton from './NavBarButton';
import Colors from 'S5Colors';

import ChatsView      from './chats';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: Colors.primaryDark,
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
    backgroundColor: Colors.primary,
    height: 52,
  }
});

export default class TabView extends Component {

  static title = 'No animation';

  static propTypes = {
    style: View.propTypes.style,
  };

  state = {
    index: 0,
    routes: [
      { key: '1', title: 'Friends', actions: [{
          icon: 'md-rewind'
        },
        {
          icon: 'md-settings'
        }], },
      { key: '2', title: 'Chats' },
      { key: '3', title: 'Profile' },
    ],
    actions: [],
  };

  _handleChangeTab = (index) => {
    this.setState({
      index,
      actions: this.state.routes[index].actions,
    });
  };

  _renderLabel = ({ navigationState }: any) => ({ route, index }) => {
    return (
      <Text style={[ styles.label, {
        color: navigationState.index === index ? Colors.primaryText : Colors.secondaryText,
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
      <TabBarTop
        {...props}
        renderLabel={this._renderLabel(props)}
        indicatorStyle={styles.indicator}
        style={styles.tabbar}
      />
    );
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
    case '1':
      return <View style={[ styles.page, { backgroundColor: '#ff4081' } ]} />;
    case '2':
      return <ChatsView style={[ styles.page, { backgroundColor: '#673ab7' } ]} />;
    case '3':
      return <View style={[ styles.page, { backgroundColor: '#4caf50' } ]} />;
    default:
      return null;
    }
  };

  _renderPager = (props) => {
    return <TabViewPagerPan {...props} swipeEnabled={true} />;
  };

  _configureTransition = () => null;

  render() {

    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, }}>

        <NavigationBar
          style={styles.toolbar}
          title={{ title: 'Stalk', }}
          rightButton={
            <NavBarButton actions={this.state.actions} />
          }
        />

        {Platform.OS === 'android' > -1 ? (

          <TabViewAnimated
            style={[ styles.container, this.props.style ]}
            navigationState={this.state}
            configureTransition={this._configureTransition}
            renderPager={this._renderPager}
            renderScene={this._renderScene}
            renderFooter={this._renderFooter}
            onRequestChangeTab={this._handleChangeTab}
          />

        ) : (

          <TabViewAnimated
            style={[ styles.container, this.props.style ]}
            navigationState={this.state}
            configureTransition={this._configureTransition}
            renderPager={this._renderPager}
            renderScene={this._renderScene}
            renderHeader={this._renderHeader}
            onRequestChangeTab={this._handleChangeTab}
          />

        )}

      </View>
    );
  }
}
